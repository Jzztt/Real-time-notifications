<?php

namespace App\Events;

use App\Models\Lane;
use App\Models\User;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class LanesUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public $message;
    public $lanes;
    public function __construct(string $message, $lanes)
    {
        //
        $this->message = $message;
        $this->lanes = $lanes;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn()
    {
        Log::debug('Lanes Updated', [$this->message, $this->lanes]);
        return new Channel('notifications');
    }

    public function broadcastWith()
    {
        return [
            'lanes' => $this->lanes->load('tickets'),
            'message' => $this->message,
        ];
    }
}
