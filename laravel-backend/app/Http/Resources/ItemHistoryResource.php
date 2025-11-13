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
            'prev_acct_owner' => e($this->prev_acct_owner),
            'prev_actual_owner' => e($this->prev_actual_owner),
            'prev_acct_user_office' => $this->prev_acct_user_office_title,
            'prev_actual_user_office' => $this->prev_actual_user_office_title,
            'new_actual_owner' => e($this->new_actual_owner),
            'new_actual_user_office' => $this->new_actual_user_office_title,
            'new_acct_owner' => e($this->new_acct_owner),
            'new_acct_user_office' => $this->new_acct_user_office_title,
            'remarks' => e($this->remarks),
        ];
    }
}
