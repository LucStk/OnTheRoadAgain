<template>

<aside id="with-navbar-sidebar" class="overlay [--auto-close:sm] sm:shadow-none overlay-open:translate-x-0 drawer drawer-start hidden max-w-64 sm:absolute sm:z-0 sm:flex sm:translate-x-0 pt-16" role="dialog" tabindex="-1" >
  <div class="drawer-body px-2 pt-4">
    <ul class="menu p-0">
      <li>
        <a href="#">
          <span class="icon-[tabler--home] size-5"></span>
          Mes parcours
        </a>
      </li>
      <li>
        <a href="#">
          <span class="icon-[tabler--user] size-5"></span>
          Account
        </a>
      </li>
      <li>
        <a href="#">
          <span class="icon-[tabler--message] size-5"></span>
          Messages
        </a>
      </li>
      <li>
        <a href="#">
          <span class="icon-[tabler--mail] size-5"></span>
          Email
        </a>
      </li>
      <li>
        <a href="#">
          <span class="icon-[tabler--calendar] size-5"></span>
          Calendar
        </a>
      </li>
      <li>
        <a href="#">
          <span class="icon-[tabler--shopping-bag] size-5"></span>
          Product
        </a>
      </li>
      <li>
        <a href="#">
          <span class="icon-[tabler--login] size-5"></span>
          Sign In
        </a>
      </li>
      <li>
        <a href="#">
          <span class="icon-[tabler--logout-2] size-5"></span>
          Sign Out
        </a>
      </li>
    </ul>
  </div>
</aside>
</template>

<style>


/* Navbar au-dessus de la carte */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background-color: #333;
  color: white;
  z-index: 10;
  display: flex;
  align-items: center;
  padding-left: 1rem;
}

/* Sidebar latéral */
.aside {
  position: fixed;
  top: 60px;
  left: 0;
  width: 250px;
  height: calc(100% - 60px);
  background-color: rgba(255, 255, 255, 0.9);
  z-index: 10;
  padding: 1rem;
}

/* Contenu principal */
.content {
  position: relative;
  margin-left: 260px;
  margin-top: 70px;
  z-index: 10;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 1rem;
  max-width: 600px;
  border-radius: 8px;
}
</style>