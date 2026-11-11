<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

final class JsonbColumnMigration
{
    public static function normalizeTranslations(string $table, array $columns): void
    {
        self::assertIdentifiers($table, $columns);

        DB::table($table)
            ->select(array_merge(['id'], $columns))
            ->orderBy('id')
            ->chunkById(100, function ($records) use ($table, $columns): void {
                foreach ($records as $record) {
                    $updates = [];

                    foreach ($columns as $column) {
                        $value = $record->{$column};

                        if ($value === null) {
                            continue;
                        }

                        $decoded = is_string($value) ? json_decode($value) : null;

                        if (is_object($decoded)) {
                            continue;
                        }

                        if (is_array($decoded)) {
                            $english = $decoded[0] ?? '';
                            $khmer = $decoded[1] ?? $english;
                        } else {
                            $text = is_string($decoded) ? $decoded : (string) $value;
                            $english = $text;
                            $khmer = $text;
                        }

                        $updates[$column] = json_encode([
                            'en' => $english,
                            'kh' => $khmer,
                        ], JSON_THROW_ON_ERROR);
                    }

                    if ($updates !== []) {
                        DB::table($table)->where('id', $record->id)->update($updates);
                    }
                }
            });
    }

    public static function toJsonb(string $table, array $columns): void
    {
        self::assertIdentifiers($table, array_keys($columns));

        if (DB::connection()->getDriverName() === 'pgsql') {
            $grammar = DB::connection()->getQueryGrammar();
            $wrappedTable = $grammar->wrapTable($table);

            foreach (array_keys($columns) as $column) {
                $wrappedColumn = $grammar->wrap($column);

                DB::statement(sprintf(
                    'ALTER TABLE %s ALTER COLUMN %s TYPE jsonb USING %s::jsonb',
                    $wrappedTable,
                    $wrappedColumn,
                    $wrappedColumn
                ));
            }

            return;
        }

        Schema::table($table, function (Blueprint $blueprint) use ($columns): void {
            foreach ($columns as $column => $nullable) {
                $definition = $blueprint->jsonb(is_int($column) ? $nullable : $column);

                if (! is_int($column) && $nullable) {
                    $definition->nullable();
                }

                $definition->change();
            }
        });
    }

    public static function fromJsonb(string $table, array $columns): void
    {
        self::assertIdentifiers($table, array_keys($columns));

        if (DB::connection()->getDriverName() === 'pgsql') {
            $grammar = DB::connection()->getQueryGrammar();
            $wrappedTable = $grammar->wrapTable($table);

            foreach ($columns as $column => $definition) {
                $type = $definition['type'] === 'string'
                    ? 'varchar('.($definition['length'] ?? 255).')'
                    : 'text';
                $wrappedColumn = $grammar->wrap($column);
                $value = $definition['localized'] ?? false
                    ? "(CASE WHEN jsonb_typeof({$wrappedColumn}) = 'object' AND {$wrappedColumn} ? 'en' THEN {$wrappedColumn}->>'en' ELSE {$wrappedColumn}::text END)"
                    : "{$wrappedColumn}::text";

                DB::statement(sprintf(
                    'ALTER TABLE %s ALTER COLUMN %s TYPE %s USING (%s)::%s',
                    $wrappedTable,
                    $wrappedColumn,
                    $type,
                    $value,
                    $type
                ));
            }

            return;
        }

        Schema::table($table, function (Blueprint $blueprint) use ($columns): void {
            foreach ($columns as $column => $definition) {
                $columnDefinition = $definition['type'] === 'string'
                    ? $blueprint->string($column, $definition['length'] ?? 255)
                    : $blueprint->text($column);

                if ($definition['nullable']) {
                    $columnDefinition->nullable();
                }

                $columnDefinition->change();
            }
        });
    }

    private static function assertIdentifiers(string $table, array $columns): void
    {
        $identifiers = array_merge([$table], $columns);

        foreach ($identifiers as $identifier) {
            if (! is_string($identifier) || ! preg_match('/^[a-z_][a-z0-9_]*$/D', $identifier)) {
                throw new InvalidArgumentException('Invalid or empty database identifier in JSONB migration.');
            }
        }

        if ($columns === []) {
            throw new InvalidArgumentException('JSONB migration requires at least one column.');
        }
    }
}
