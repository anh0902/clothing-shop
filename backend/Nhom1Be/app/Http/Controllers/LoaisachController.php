<?php

namespace App\Http\Controllers;
use App\Models\Loaisach;
use Illuminate\Http\Request;

class LoaisachController extends Controller
{
    public function index()
    {
        $loaisach = Loaisach::with('sachs')->get();
        return response()->json([
            'success' => true,
            'data'    => $loaisach
        ]);
    }

    public function show($id)
    {

        $loaisach = Loaisach::with('sachs')->findOrFail($id);
        
        return response()->json([
            'success' => true,
            'data'    => $loaisach
        ]);
    }
    
}
