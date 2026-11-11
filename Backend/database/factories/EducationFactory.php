<?php

namespace Database\Factories;

use App\Models\Education;
use Illuminate\Database\Eloquent\Factories\Factory;

class EducationFactory extends Factory
{
    protected $model = Education::class;

    public function definition(): array
    {
        $degreeEn = fake()->randomElement(['Bachelor of Science', 'Master of Science', 'Bachelor of Arts', 'Associate Degree', 'PhD']);
        $institutionEn = fake()->randomElement([
            'University of Technology',
            'State University',
            'Institute of Technology',
            'College of Engineering',
            'National University',
        ]);
        $fieldEn = fake()->randomElement(['Computer Science', 'Information Technology', 'Software Engineering', 'Data Science', 'Business Administration']);

        return [
            'degree' => [
                'en' => $degreeEn,
                'kh' => 'បរិញ្ញាប័ត្រ ' . fake()->word(),
            ],
            'institution' => [
                'en' => $institutionEn,
                'kh' => 'សាកលវិទ្យាល័យ ' . fake()->word(),
            ],
            'school_logo' => null,
            'field_of_study' => [
                'en' => $fieldEn,
                'kh' => 'វិទ្យាសាស្ត្រ ' . fake()->word(),
            ],
            'description' => [
                'en' => fake()->paragraphs(2, true),
                'kh' => 'ការពិពណ៌នាអំពីការសិក្សា ' . fake()->sentence(5),
            ],
            'start_date' => fake()->dateTimeBetween('-10 years', '-4 years')->format('Y-m-d'),
            'end_date' => fake()->dateTimeBetween('-4 years', 'now')->format('Y-m-d'),
        ];
    }
}