<?php

namespace App\Policies;

use App\Models\ItemHistory;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ItemHistoryPolicy
{
    /**
     * Determine whether the user can view any models.
     */

    public function transfer(User $user, ItemHistory $itemHistory = null)
    {
        return $user->is_admin === "1";
    }


    public function viewHistory(User $user)
    {
        return in_array($user->is_admin, [1]); // admin & staff can view
    }


    public function viewAny(User $user): bool
    {
        //
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, ItemHistory $itemHistory): bool
    {
        //
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        //
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, ItemHistory $itemHistory): bool
    {
        //
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, ItemHistory $itemHistory): bool
    {
        //
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, ItemHistory $itemHistory): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, ItemHistory $itemHistory): bool
    {
        //
    }
}
