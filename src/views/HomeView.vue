<script setup lang="ts">
import { ApiRoutes } from '@/utils/constant/endpoint';
import type { IDevise } from '@/utils/interface/IDevise';
import type { IStock } from '@/utils/interface/IStock';
import { useAxiosRequestWithToken } from '@/utils/service/api';
import { ref, watchEffect } from 'vue';
import { Loader } from '@progress/kendo-vue-indicators'

const totalQteSortie = ref<number>(0)
const totalQteEntrer = ref<number>(0)
const totalQteAll    = ref<number>(0)
const type = "infinite-spinner"
const loader       = ref<Boolean>(false)
const show       = ref<any>(true)
const devise = ref<Array<IDevise>>([])
const stock = ref<Array<IStock>>()
  watchEffect(async()=>{
        await(useAxiosRequestWithToken().get(`${ApiRoutes.StockList}`)
            .then(function (response) {
              stock.value = response.data.stocks as Array<IStock>
                console.log("rep->",stock)
              stock.value.map((v :IStock ,k:number)=>{
                totalQteEntrer.value += v.quantiteEntree - v.quantiteSortie
                totalQteSortie.value += v.quantiteSortie
                totalQteAll.value    += v.quantiteEntree
              })  
            })
            .catch(function (error) {
                console.log(error);
            })
            .finally(function () {
                //alert("Elie Oko");
                show.value = false
            }));
    })  
    watchEffect(async()=>{
        await(useAxiosRequestWithToken().get(`${ApiRoutes.DeviseList}`)
            .then(function (response) {
                console.log("devise",response.data)
                devise.value = response.data.devises as Array<IDevise>
            })
            .catch(function (error) {
                console.log(error);
            })
            .finally(function () {
                //alert("Elie Oko");
            }));
    })
</script>

<template>
  <main class="h-full overflow-y-auto">
                <div class="container px-6 mx-auto grid">
                    <h2 class="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
                        Drapeau Ya Mboka
                    </h2>
                    <div class="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
                        <!-- Card -->
                        <a href="#" class="flex items-center p-4 bg-white border border-1 border-gray-100 rounded-lg  shadow-xs dark:bg-gray-800">
                            <div class="p-3 mr-4 text-orange-500 bg-orange-100 rounded-full dark:text-orange-100 dark:bg-orange-500">
                                <i class="w-5 h-5 fa fa-store"></i>
                            </div>
                            <div>
                                <p class="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Quantité En Stock
                                </p>
                                <p class="text-lg font-semibold text-gray-700 dark:text-gray-200">
                                    {{ totalQteEntrer }}
                                </p>
                            </div>
                        </a>
                        <!-- Card -->
                        <div class="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
                            <div class="p-3 mr-4 text-green-500 bg-green-100 rounded-full dark:text-green-100 dark:bg-green-500">
                                <i class="w-5 h-5 fa fa-store"></i>
                            </div>
                            <div>
                                <p class="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                                   Tous les Entrées en Stock
                                </p>
                                <p class="text-lg font-semibold text-gray-700 dark:text-gray-200">
                                    {{ totalQteAll }}
                                </p>
                            </div>
                        </div>
                        <!-- Card -->
                        <div class="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
                            <div class="p-3 mr-4 text-blue-500 bg-blue-100 rounded-full dark:text-blue-100 dark:bg-blue-500">
                                <i class="w-5 h-5 fa fa-store"></i>
                            </div>
                            <div>
                                <p class="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Sortie en Stock
                                </p>
                                <p class="text-lg font-semibold text-gray-700 dark:text-gray-200">
                                    {{ totalQteSortie }}
                                </p>
                            </div>
                        </div>
                        <!-- Card -->
                        <div class="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
                            <div class="p-3 mr-4 text-teal-500 bg-teal-100 rounded-full dark:text-teal-100 dark:bg-teal-500">
                                <i class="w-5 h-5 fa fa-money-bill"></i>
                            </div>
                            <div>
                                <p class="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Taux du jour
                                </p>
                                <p class="text-lg font-semibold text-gray-700 dark:text-gray-200">
                                   {{"1$ = "}}{{ devise[0]?.taux}}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- component -->
                <div class="flex items-center justify-center  bg-gray-100">
                    <section class="w-full p-6 rounded-lg max-w-2xl shadow-lg shadow-gray-300 bg-white">
                        <header class="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 shrink-0 w-6 h-6 text-gray-500" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <path d="M4 19l16 0"></path>
          <path d="M4 15l4 -6l4 2l4 -5l4 4"></path>
        </svg>
              <h3 class="font-medium text-lg">
                Stock
              </h3>
          <svg xmlns="http://www.w3.org/2000/svg" class="ml-2 shrink-0 w-6 h-6 text-gray-500" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"></path>
          <path d="M12 9h.01"></path>
          <path d="M11 12h1v4h1"></path>
        </svg>
    </header>
    <section class="py-4 grid grid-cols-2 gap-x-6">
      <div v-for="(item,index) in stock" class="flex items-center py-3">
        <span class="w-8 h-8 shrink-0 mr-4 rounded-full bg-blue-50 flex items-center justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="w-5 h-5 text-blue-500"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                stroke-width="2"
                                stroke="currentColor"
                                fill="none"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                >
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <path
                                    d="M6.331 8h11.339a2 2 0 0 1 1.977 2.304l-1.255 8.152a3 3 0 0 1 -2.966 2.544h-6.852a3 3 0 0 1 -2.965 -2.544l-1.255 -8.152a2 2 0 0 1 1.977 -2.304z"
                                ></path>
                                <path d="M9 11v-5a3 3 0 0 1 6 0v5"></path>
                                </svg>
              </span>  
          <div class="space-y-3 flex-1">
                <div class="flex items-center">
                  
                    <h4 class="font-medium text-sm mr-auto text-gray-700 flex items-center">
                      {{ item.article.nom }}
                    <svg xmlns="http://www.w3.org/2000/svg" class="ml-2 shrink-0 w-5 h-5 text-gray-500" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                      <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"></path>
                      <path d="M12 9h.01"></path>
                      <path d="M11 12h1v4h1"></path>
                    </svg>
                    </h4>
                 <span class="px-2 py-1 rounded-lg bg-blue-200 w-[95px] text-gray-800 text-xs">
                  <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 shrink-0 w-6 h-6 text-gray-500" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M4 19l16 0"></path>
                    <path d="M4 15l4 -6l4 2l4 -5l4 4"></path>
                   
                  </svg>
                  {{ item.quantiteEntree - item.quantiteSortie }}
                  </span>  
                </div>
                <div class="overflow-hidden bg-blue-50 h-1.5 rounded-full w-full">
                  <span class="h-full bg-blue-500 w-full block rounded-full" :style="{'width':((item.quantiteEntree - item.quantiteSortie) /item.quantiteEntree) * 100 + '%'}"></span>
                </div>
              </div>
      </div>                  
    </section>
    <footer class="border-t border-gray-100 pt-4">
      <p class="text-sm text-gray-500 text-center">From <span class="font-bold">KongoCode</span></p>
    </footer>
    </section>
  </div>
</main>
    <div v-if="show" class="k-loader-container k-loader-container-md k-loader-top">
      <div class="k-loader-container-overlay k-overlay-dark" />
      <div class="k-loader-container-inner">
        <Loader :size="'large'" :type="type" />
      </div>
    </div>
</template>
