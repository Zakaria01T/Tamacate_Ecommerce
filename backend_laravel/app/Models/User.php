<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; // Import the HasApiTokens trait

class User extends Authenticatable
{
    use HasApiTokens, Notifiable; 
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['first_name','last_name', 'email', 'password','image']; 

    protected $table = 'users';
    // Define user role constants (optional, uncomment if using)
    // const ROLE_USER = 'user';
    // const ROLE_ADMIN = 'admin';

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_recovery_codes',
        'two_factor_secret',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array<int, string>
     */
    protected $appends = [
        'profile_photo_url',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function getProfilePhotoUrlAttribute()
    {
         return 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg'; // Example placeholder
    }
}
