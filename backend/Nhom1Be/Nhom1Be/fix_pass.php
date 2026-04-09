<?php
use App\Models\Nguoidung;
use Illuminate\Support\Facades\Hash;

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$users = Nguoidung::whereIn('id', [1, 2])->get();
foreach ($users as $user) {
    if (!Hash::needsRehash($user->mat_khau)) {
        // If it's already hashed, this might skip, so let's force it for '123456'
    }
    $user->mat_khau = Hash::make('123456');
    $user->save();
    echo "Updated user: " . $user->ten_dang_nhap . "\n";
}
echo "Done\n";
