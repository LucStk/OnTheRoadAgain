<template>
  <nav class="navbar bg-base-100 
              max-sm:rounded-box 
              max-sm:shadow-sm sm:border-b 
              border-base-content/25 
              sm:z-1 relative">

    <button type="button" 
            class="btn btn-text max-sm:btn-square sm:hidden me-2" 
            aria-haspopup="dialog" 
            aria-expanded="false" 
            aria-controls="with-navbar-sidebar" 
            data-overlay="#with-navbar-sidebar" >
            
      <span class="icon-[tabler--menu-2] size-5"></span>

    </button>
    <div class="navbar-start flex flex-1 items-center">
      <a class="link text-base-content link-neutral text-xl font-semibold no-underline" href="#">
        On the Road Again
      </a>
    </div>

    <div class="navbar-center">
      <Searchbar />
    </div>

    <div class="navbar-end flex items-center gap-4">
      <Notification />
      <LoginDropDown />
    </div>
  </nav>

</template>

