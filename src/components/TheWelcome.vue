<script setup lang="ts">
import { ref } from 'vue';


</script>

<template>
<aside class="z-20 hidden w-64 overflow-y-auto bg-white dark:bg-gray-800 md:block flex-shrink-0">
            <div class="py-4 text-gray-500 dark:text-gray-400">
                <a class="ml-6 text-lg font-bold text-gray-800 dark:text-gray-200" href="#">
            Drapeau Ya Mboka 
          </a>
                <ul class="mt-6">
                    <li class="relative px-6 py-3">
                        <span class="absolute inset-y-0 left-0 w-1 bg-blue-500 rounded-tr-lg rounded-br-lg" aria-hidden="true"></span>
                        <a class="inline-flex items-center w-full text-sm font-semibold text-gray-800 transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 dark:text-gray-100" href="index.html">
                            <i class="fa fa-home"></i>
                            <span class="">Accueil</span>
                            
                        </a>
                    </li>
                </ul>
                <ul>
                    <li class="relative px-6 py-3">
                        <a class="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200" href="#">
                            <i class="fa fa-shopping-cart"></i>
                            <span class="">Article</span>
                        </a>
                    </li>
                    <li class="relative px-6 py-3">
                        <a class="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200" href="AjoutArticle.html">
                            <i class="fa fa-cart-plus"></i>
                            

                            <router-link to="/article/add">Ajout Article</router-link>
                        </a>
                    </li>
                    <li class="relative px-6 py-3 ">
                        <a class="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200" href="ArtcleAll.html">
                            <i class="fa fa-eye"></i>
                            <router-link to="/article">Voir tout les article</router-link>
                        </a>
                    </li>
                    <li class="relative px-6 py-3 border-t border-gray-200 dark:border-gray-700">
                        <a class="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200" href="#">

                            <i class="fa fa-money-bill"></i>
                            <span class="">Facturation</span>
                        </a>
                    </li>
                    <li class="relative px-6 py-3">
                        <a class="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200" href="Facturation_Client.html">
                            <i class="fa fa-money-bill-wave"></i>
                            <router-link to="/facturation/add">Facturation Cliente</router-link>
                            
                        </a>
                    </li>
                    <li class="relative px-6 py-3">
                        <a class="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200" href="FactureAll.html">
                            <i class="fa fa-history"></i>
                            <router-link to="/facturation">Voir toutes les Facturations</router-link>
                        </a>
                    </li>

                    <li class="relative px-6 py-3 border-t border-gray-200 dark:border-gray-700 ">
                        <a class="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200" href="#">
                            <i class="fa fa-archive"></i>
                            <span class="">Stock</span>
                        </a>
                    </li>
                    <li class="relative px-6 py-3 ">
                        <a class="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200" href="tables.html">
                            <i class="fa fa-history"></i>
                            <router-link to="/stock/add">Ajouter Article Stock</router-link>
                        </a>
                    </li>
                    <li class="relative px-6 py-3">
                        <a class="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200" href="HistoryStockEntrer.html">
                            <i class="fa fa-history"></i>
                            <router-link to="/stock/historique/entree">Historique Entrée</router-link>
                            <span class="ml-4"></span>
                        </a>
                    </li>
                    <li class="relative px-6 py-3">
                        <a class="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200" href="tables.html">
                            <i class="fa fa-history"></i>
                            <router-link to="/stock/historique/sortie">Historique Sortie</router-link>
                        </a>
                    </li>
                </ul>
                <div class="px-6 my-6">
                    <router-link to="/login">
                        <button class="flex items-center justify-between w-full px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple">
                                Deconnexion
                                <span class="ml-2 fa fa-sign-out" aria-hidden="true"></span>
                        </button>
                    </router-link>
                    
                </div>
            </div>
        </aside>
        <!-- Mobile sidebar -->
        <!-- Backdrop -->
        <div x-show="isSideMenuOpen" x-transition:enter="transition ease-in-out duration-150" x-transition:enter-start="opacity-0" x-transition:enter-end="opacity-100" x-transition:leave="transition ease-in-out duration-150" x-transition:leave-start="opacity-100"
            x-transition:leave-end="opacity-0" class="fixed inset-0 z-10 flex items-end bg-black bg-opacity-50 sm:items-center sm:justify-center">
        </div>
        <aside class="fixed inset-y-0 z-20 flex-shrink-0 w-64 mt-16 overflow-y-auto md:hidden" x-transition:enter="transition ease-in-out duration-150" x-transition:enter-start="opacity-0 transform -translate-x-20"
            x-transition:enter-end="opacity-100" x-transition:leave="transition ease-in-out duration-150" x-transition:leave-start="opacity-100" x-transition:leave-end="opacity-0 transform -translate-x-20" >
            <div class="py-4 text-gray-500 dark:text-gray-400">
                <a class="ml-6 text-lg font-bold text-gray-800 dark:text-gray-200" href="#">
           Drapeau Ya Mboka
          </a>
                <ul class="mt-6">
                    <li class="relative px-6 py-3">
                        <span class="absolute inset-y-0 left-0 w-1 bg-blue-500 rounded-tr-lg rounded-br-lg" aria-hidden="true"></span>
                        <a class="inline-flex items-center w-full text-sm font-semibold text-gray-800 transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 dark:text-gray-100" href="index.html">
                            <font-awesome-icon icon="house" />
                            <span class="ml-4">Accueil</span>
                        </a>
                    </li>
                </ul>
                <ul>
                    <li class="relative px-6 py-3">
                        <a class="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200" href="AjoutArticle.html">
                            <i class="fa fa-shopping-cart"></i>
                           
                            <span class="ml-4">Article</span>
                        </a>
                    </li>
                    <li class="relative px-6 py-3">
                        <a class="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200" href="AjoutArticle.html">
                            <i class="fa fa-cart-plus"></i>
                            <span class="ml-4">Ajout Article </span>
                        </a>
                    </li>
                    <li class="relative px-6 py-3 ">
                        <a class="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200" href="ArtcleAll.html">
                            <i class="fa fa-eye"></i>
                            <span class="ml-4">Voir tout les article</span>
                        </a>
                    </li>
                    <li class="relative px-6 py-3 border-t border-gray-200 dark:border-gray-700">
                        <a class="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200" href="#">

                            <i class="fa fa-money-bill"></i>
                            <span class="ml-4">Facturation</span>
                        </a>
                    </li>
                    <li class="relative px-6 py-3">
                        <a class="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200" href="Facturation_Client.html">
                            <i class="fa fa-money-bill-wave"></i>
                            <span class="ml-4">Facturation Client</span>
                        </a>
                    </li>
                    <li class="relative px-6 py-3">
                        <a class="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200" href="FactureAll.html">
                            <i class="fa fa-history"></i>
                            <span class="ml-4">Voir toutes les Facturations</span>
                        </a>
                    </li>

                    <li class="relative px-6 py-3 border-t border-gray-200 dark:border-gray-700 ">
                        <a class="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200" href="#">
                            <i class="fa fa-archive"></i>
                            <span class="ml-4">Stock</span>
                        </a>
                    </li>
                    <li class="relative px-6 py-3  ">
                        <a class="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200" href="Stock.html">
                            <i class="fa fa-archive"></i>
                            <span class="ml-4">Stock</span>
                        </a>
                    </li>
                    <li class="relative px-6 py-3 ">
                        <a class="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200" href="tables.html">
                            <i class="fa fa-history"></i>
                            <span class="ml-4">Ajouter Article Stock </span>
                        </a>
                    </li>
                    <li class="relative px-6 py-3">
                        <a class="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200" href="HistoryStockEntrer.html">
                            <i class="fa fa-history"></i>
                            <span class="ml-4">Historique Entrée </span>
                        </a>
                    </li>
                    <li class="relative px-6 py-3">
                        <a class="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200" href="tables.html">
                            <i class="fa fa-history"></i>
                            <span class="ml-4"> Historique Sortie</span>
                        </a>
                    </li>


                </ul>
                <div class="px-6 my-6">
                    <button class="flex items-center justify-between w-full px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple">
            Deconexion 
            <span class="ml-2 fa fa-sign-out" aria-hidden="true"></span>
          </button>
                </div>
            </div>
        </aside>
</template>