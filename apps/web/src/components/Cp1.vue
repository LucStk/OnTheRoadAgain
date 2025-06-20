
<template>
    <div class="dropdown relative inline-flex">
    <button id="dropdown-header" type="button" class="dropdown-toggle btn btn-primary" aria-haspopup="menu" aria-expanded="false" aria-label="Dropdown">
        Dropdown header
        <span class="icon-[tabler--chevron-down] dropdown-open:rotate-180 size-4"></span>
    </button>
    <ul class="dropdown-menu dropdown-open:opacity-100 hidden min-w-60" role="menu" aria-orientation="vertical" aria-labelledby="dropdown-header">
        <li class="dropdown-header gap-2">
        <div class="avatar">
            <div class="w-10 rounded-full">
            <img src="https://cdn.flyonui.com/fy-assets/avatar/avatar-2.png" alt="User Avatar" />
            </div>
        </div>
        <div>
            <h6 class="text-base-content text-base font-semibold">John Doe</h6>
            <small class="text-base-content/50 text-sm text-amber-200 font-normal">jhon@doe.com</small>
        </div>
        </li>
        <li><a class="dropdown-item" href="#">My Profile</a></li>
        <li><a class="dropdown-item" href="#">Settings</a></li>
        <li><a class="dropdown-item" href="#">Billing</a></li>
        <li><a class="dropdown-item" href="#">FAQs</a></li>
    </ul>
    </div>
</template>