<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExperienceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'job_title' => $this->job_title,
            'company_name' => $this->company_name,
            'company_logo' => $this->company_logo,
            'location' => $this->location,
            'description' => $this->description,
            'start_date' => $this->start_date,
            'end_date' => $this->end_date,
            'is_current' => $this->is_current,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}