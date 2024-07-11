<?php

namespace App\Http\Controllers;

use App\Events\LanesUpdated;
use App\Models\Lane;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class LaneController extends Controller
{
    //
    public function index()
    {
        $lanes = Lane::with('tickets')->get();
        return view('home', compact('lanes'));
    }

    public function moveTask(Request $request)
    {
        $taskId = $request->input('task_id');
        $newListId = $request->input('lane_id');
        $user = auth()->user();

        $task = Ticket::find($taskId);
        $task->lane_id = $newListId;
        $task->save();
        $lanes = Lane::with('tickets')->get();
        broadcast(new LanesUpdated('Lanes Updated',  $lanes, "success"))->toOthers();

        return response()->json(['message' => 'Task moved successfully']);
    }
}
