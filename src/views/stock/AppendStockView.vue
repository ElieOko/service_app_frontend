<script setup lang="ts">
import { ApiRoutes } from '@/utils/constant/endpoint';
import { dateConvert } from '@/utils/constant/fun';
import type { IArticle } from '@/utils/interface/IArticle';
import type { IStockRequest } from '@/utils/interface/IStock';
import { useAxiosRequestWithToken } from '@/utils/service/api';
import { ref, watchEffect } from 'vue';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const stock = ref<IStockRequest>({
  article_fk:0,
  quantiteEntree :0

})
const article = ref<Array<IArticle>>([])
  const notify = (msg:string) => {
      toast(msg, {
        autoClose: 8000,
      });
      }
watchEffect(async()=>{
        await(useAxiosRequestWithToken().get(`${ApiRoutes.ArticleList}`)
            .then(function (response) {
              article.value = response.data.articles as Array<IArticle>               
            })
            .catch(function (error) {
                console.log(error);
            })
            .finally(function () {
                //alert("Elie Oko");
            }));
    })
    const submit_stock = async ()=>{
        const data = (JSON.parse(JSON.stringify(stock.value))) as IStockRequest ;
        if( data.article_fk == 0 || data.quantiteEntree == 0 ){
            notify("Certains champs sont vide");
            return
        }
        await(useAxiosRequestWithToken().post(`${ApiRoutes.StockCreate}`,data)
            .then(function (response) {
                notify(response.data.message)
            })
            .catch(function (error) {
                console.log(error);
            })
            .finally(function () {
                //alert("Elie Oko");
            }))
    }    
</script>

<template>
  <main class="h-full pb-16 overflow-y-auto">
                <div class="container grid px-6 mx-auto">
                    <h2 class="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
                        Stock Ajout
                    </h2>
                    <form class="w-full"  @submit.prevent="submit_stock">
                        <div class="flex flex-wrap -mx-3 mb-2">
                          <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-state">
                                    Article
                                </label>
                                <div class="relative">
                                    <select v-model="stock.article_fk" class="block appearance-none w-full border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state">
                                      <option v-for="(item,index) in article" :value ="item.id">{{ item.nom }}</option>
                                    </select>
                                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    </div>
                                </div>
                            </div>
                            <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-zip">
                          Quantité
                        </label>
                                <input v-model="stock.quantiteEntree" class="appearance-none block w-full text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-zip" type="number" placeholder="90210">
                            </div>
                        </div>
                        <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Ajouter au stock</button>
                    </form>

                    <!-- With actions -->
                    <h4 class="mb-4 text-lg font-semibold text-gray-600 dark:text-gray-300">
                        Table with actions
                    </h4>
                    <div class="w-full overflow-hidden rounded-lg shadow-xs">
                        <div class="w-full overflow-x-auto">
                            <table class="w-full whitespace-no-wrap">
                                <thead>
                                    <tr class="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                                        <th class="px-4 py-3">Code</th>
                                        <th class="px-4 py-3">Nom</th>
                                        <th class="px-4 py-3">Prix achat</th>
                                        <th class="px-4 py-3">Prix de vente</th>
                                        <th class="px-4 py-3">Total Vente</th>
                                        <th class="px-4 py-3">Qté en Stock

                                            <p class=" text-gray-400 dark:text-gray-400">
                                                (Récent)
                                            </p>
                                        </th>
                                        <th class="px-4 py-3">Qté Réel en Stock</th>


                                        <th class="px-4 py-3">Statut</th>



                                        <th class="px-4 py-3">Date</th>
                                    </tr>
                                </thead>
                                <tbody class="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                                    <tr class="text-gray-700 dark:text-gray-400">

                                        <td class="px-4 py-3 text-sm">
                                            18788
                                        </td>
                                        <td class="px-4 py-3 text-sm">
                                            Tomate
                                        </td>

                                        <td class="px-4 py-3 text-sm">
                                            6 $
                                        </td>
                                        <td class="px-4 py-3 text-sm">
                                            16 $
                                        </td>
                                        <td class="px-4 py-3 text-sm">
                                            16
                                        </td>

                                        <td class="px-4 py-3 text-sm">
                                            52
                                        </td>

                                        <td class="px-4 py-3 text-sm">
                                            52
                                        </td>
                                        <td class="px-4 py-3 text-xs">
                                            <span class="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full dark:bg-green-700 dark:text-green-100">
                                    Pris en compte
                                  </span>
                                        </td>
                                        <td class="px-4 py-3 text-sm">
                                            6/10/2020
                                        </td>

                                    </tr>
                                    <tr class="text-gray-700 dark:text-gray-400">

                                        <td class="px-4 py-3 text-sm">
                                            18788
                                        </td>
                                        <td class="px-4 py-3 text-sm">
                                            Tomate
                                        </td>

                                        <td class="px-4 py-3 text-sm">
                                            6 $
                                        </td>
                                        <td class="px-4 py-3 text-sm">
                                            16 $
                                        </td>
                                        <td class="px-4 py-3 text-sm">
                                            16
                                        </td>

                                        <td class="px-4 py-3 text-sm">
                                            150
                                        </td>



                                        <td class="px-4 py-3 text-sm">
                                            52
                                        </td>
                                        <td class="px-4 py-3 text-xs">
                                            <span class="px-2 py-1 font-semibold leading-tight text-red-700 bg-red-100 rounded-full dark:bg-red-700 dark:text-red-100">
                                          En rupture
                                        </span>
                                        </td>
                                        <td class="px-4 py-3 text-sm">
                                            6/10/2020
                                        </td>

                                    </tr>

                                </tbody>


                            </table>
                        </div>


                        <div class="grid px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t dark:border-gray-700 bg-gray-50 sm:grid-cols-9 dark:text-gray-400 dark:bg-gray-800">

                            <span class="flex items-center col-span-3">
                  Showing 21-30 of 100
                </span>
                            <span class="col-span-2"></span>
                            <!-- Pagination -->
                            <span class="flex col-span-4 mt-2 sm:mt-auto sm:justify-end">
                  <nav aria-label="Table navigation">
                    <ul class="inline-flex items-center">
                      <li>
                        <button
                          class="px-3 py-1 rounded-md rounded-l-lg focus:outline-none focus:shadow-outline-purple"
                          aria-label="Previous"
                        >
                          <svg
                            class="w-4 h-4 fill-current"
                            aria-hidden="true"
                            viewBox="0 0 20 20"
                          >
                            <path
                              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                              clip-rule="evenodd"
                              fill-rule="evenodd"
                            ></path>
                          </svg>
                        </button>
                      </li>
                      <li>
                        <button
                          class="px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-purple"
                        >
                          1
                        </button>
                      </li>
                      <li>
                        <button
                          class="px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-purple"
                        >
                          2
                        </button>
                      </li>
                      <li>
                        <button
                          class="px-3 py-1 text-white transition-colors duration-150 bg-purple-600 border border-r-0 border-purple-600 rounded-md focus:outline-none focus:shadow-outline-purple"
                        >
                          3
                        </button>
                      </li>
                      <li>
                        <button
                          class="px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-purple"
                        >
                          4
                        </button>
                      </li>
                      <li>
                        <span class="px-3 py-1">...</span>
                            </li>
                            <li>
                                <button class="px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-purple">
                          8
                        </button>
                            </li>
                            <li>
                                <button class="px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-purple">
                          9
                        </button>
                            </li>
                            <li>
                                <button class="px-3 py-1 rounded-md rounded-r-lg focus:outline-none focus:shadow-outline-purple" aria-label="Next">
                          <svg
                            class="w-4 h-4 fill-current"
                            aria-hidden="true"
                            viewBox="0 0 20 20"
                          >
                            <path
                              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                              clip-rule="evenodd"
                              fill-rule="evenodd"
                            ></path>
                          </svg>
                        </button>
                            </li>
                            </ul>
                            </nav>
                            </span>
                        </div>
                    </div>
                </div>
            </main>

</template>