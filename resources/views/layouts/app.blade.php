<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SPA com Vue.js e Tailwind</title>
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
</head>
<body class="bg-gray-200 h-screen font-sans">

<div id="app" class="h-screen flex flex-col">
    <header-component></header-component>
    <div class="flex-1 flex">
        <column-one class="w-64 bg-gray-200"></column-one>
        <column-two class="flex-grow bg-gray-300"></column-two>
        <column-three class="w-64 bg-gray-200"></column-three>
    </div>

    <footer-component></footer-component>
</div>

<script src="{{ asset('js/app.js') }}"></script>
</body>
</html>
