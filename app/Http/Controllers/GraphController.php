<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Graph;
class GraphController extends Controller
{
    public function store(Request $request)
    {
        $xmlData = $request->get('data');

        $graph = new Graph();
        $graph->data = $xmlData;
        $graph->save();

        return response()->json(['success' => true, 'id' => $graph->id]);
    }
    public function getLatestDiagram()
    {
        $graph = Graph::latest()->first();
        return response($graph->data);
    }

}
