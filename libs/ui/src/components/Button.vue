<template>
    <div class="btn text-4xl m-20 font-bold text-green-50 bg-blue">
        <p class="text-red-600">The quick brown fox...</p> Coucou de l'UI</div>
    <div class="join">
    <input class="input join-item" placeholder="Email" />
    <div class="dropdown relative inline-flex w-full">
        <button id="dropdown-input" type="button" class="dropdown-toggle btn btn-primary join-item" aria-haspopup="menu" aria-expanded="false" aria-label="Dropdown">
        Dropdown
        <span class="icon-[tabler--chevron-down] dropdown-open:rotate-180 size-4"></span>
        </button>
        <ul class="dropdown-menu dropdown-open:opacity-100 hidden" role="menu" aria-orientation="vertical" aria-labelledby="dropdown-input">
        <li><a class="dropdown-item" href="#">Subscribe</a></li>
        <li><a class="dropdown-item" href="#">Verify</a></li>
        </ul>
    </div>
    </div>
</template>
