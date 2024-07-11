<?php

namespace App\Http\Controllers;

use App\Events\LanesUpdated;
use App\Models\Lane;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class TicketController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        // fix lane_id
        $lane_id = 1;
        $title = $request->input('title');

        Ticket::create(['title' => $title, 'lane_id' => $lane_id]);
        $lanes = Lane::with('tickets')->get();

        broadcast(new LanesUpdated('Tickets Created',  $lanes))->toOthers();;
        return view('home', compact('lanes'));
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        $ticket = Ticket::find($id);
        $ticket->delete();
        $lanes = Lane::with('tickets')->get();
        broadcast(new LanesUpdated('Tickets Deleted ',  $lanes))->toOthers();;
        return view('home', compact('lanes'));
    }
}
