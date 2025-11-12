<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ItemHistoryResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'item_id' => $this->item_id,
            'date_transferred' => $this->date_transferred,
            'prev_owner' => e($this->prev_owner), // escape output
            'prev_office' => $this->prev_office_name ?? null,
            'new_owner' => e($this->new_owner),
            'new_office' => $this->new_office_name ?? null,
            'remarks' => e($this->remarks),
            // Optionally hide recorded_by or expose only user info
        ];
    }
}
