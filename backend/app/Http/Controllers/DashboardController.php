<?php

namespace App\Http\Controllers;

use App\Http\Resources\DashboardStatsResource;
use App\Services\DashboardService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __construct(private readonly DashboardService $dashboard) {}

    public function stats(Request $request): JsonResponse
    {
        return new JsonResponse((new DashboardStatsResource($this->dashboard->stats()))->resolve($request));
    }
}
