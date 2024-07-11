@extends('layouts.app')

@section('content')


<div class="board">
    <form id="todo-form" method="POST">
        <input type="text" placeholder="New TODO..." id="todo-input" name="title" />
        <button type="submit">Add +</button>
    </form>

    <div class="lanes">
        @foreach($lanes as $lane)
        <div class="swim-lane" id="todo-lane" data-lane-id="{{$lane->id}}">
            <h3 class=" heading">{{$lane -> name}}</h3>
            @foreach($lane->tickets as $ticket)
            <div class="task d-flex justify-content-between align-items-center" draggable="true"
                data-task-id="{{$ticket->id}}">
                <span>
                    {{$ticket->title}}
                </span>
                <div class="action d-flex align-items-center gap-3">
                    <i class="fa-solid fa-gear"></i>
                    <button class="delete-ticket border-0 bg-transparent" data-id="{{ $ticket->id }}">
                        <i class="fa-solid fa-trash"></i>
                    </button>

                </div>
            </div>
            @endforeach
        </div>
        @endforeach
    </div>


    @push('scripts')
    <script>
    </script>
    <script src="https://kit.fontawesome.com/965753faab.js" crossorigin="anonymous"></script>


    @endpush

    @endsection