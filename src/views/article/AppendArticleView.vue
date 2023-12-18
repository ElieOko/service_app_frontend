<script lang="ts" setup>
import { ApiRoutes } from '@/utils/constant/endpoint';
import type { IArticleRequest } from '@/utils/interface/IArticle';
import type { IDevise } from '@/utils/interface/IDevise';
import { useAxiosRequestWithToken } from '@/utils/service/api';
import { computed, ref, watchEffect } from 'vue';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
    const article = ref<IArticleRequest>({
        nom : "",
        prixUnitaire : 0,
        devise_fk :0
    });
    const devise = ref<Array<IDevise>>()
    const errorPrix = computed(() => {
      return article.value.prixUnitaire === 0 || article.value.prixUnitaire === "" ? "Entrez le  prix unitaire valide" : "";
    });
    const errorNom = computed(() => {
      return article.value.nom === "" ? "Entrez un nom d'article valide" : "";
    });
    const errorDevise = computed(() => {
      return article.value.devise_fk === 0  ? "Entrez la devise" : "";
    });
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
    const notify = (msg:string) => {
      toast(msg, {
        autoClose: 8000,
      });
      }
    const submit_new_article = async ()=>{
        const data = (JSON.parse(JSON.stringify(article.value))) as IArticleRequest ;
        if( data.devise_fk == 0 || data.prixUnitaire == 0 ||  data.nom == "" ){
            notify("Certains champs sont vide");
            return
        }
        await(useAxiosRequestWithToken().post(`${ApiRoutes.ArticleCreate}`,data)
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
                <div class="container px-6 mx-auto grid">
                    <h2 class="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
                        Ajout Article
                    </h2> 
                    <form  @submit.prevent="submit_new_article" class="w-full max-w-full p-4 z-10 py-4 bg-white shadow-md dark:bg-gray-800">
                        <div class="flex flex-wrap -mx-3 mb-6">
                            <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                            Nom de L'article
                          </label>
                                <input v-model="article.nom" class="appearance-none block w-full text-gray-700 border border-gray-200  rounded py-3 px-4 leading-tight focus:outline-none  focus:bg-white" id="grid-name" type="text" placeholder="ex:Riz">
                                <label class="text-red-500" v-if="errorNom">{{ errorNom }}</label>
                            </div>
                            <div class="w-full md:w-1/2 px-3">
                                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-last-name">
                            Prix Unitaire de l'article
                          </label>
                                <input v-model="article.prixUnitaire" class="appearance-none block w-full  text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-last-name" type="number"  >
                                <label class="text-red-500" v-if="errorPrix">{{ errorPrix }}</label>
                            </div>
                        </div>
                        <div class="w-full mb-6 md:mb-0">
                            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-devise">
                           Devise
                          </label>
                            <div class="relative">
                                <select v-model="article.devise_fk" class="block appearance-none w-full  border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-devise">
                                    <option v-for="(item, index) in devise" :value="(item.id as number)">{{ item.code}}({{ item.nom }})</option>
                                </select>
                                <label class="text-red-500" v-if="errorDevise">{{ errorDevise }}</label>
                                
                                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                </div>
                            </div>
                        </div>
                        <div class="w-full md:w-1/2 mt-6 px-3">
                            <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-1 focus:ring-blue-300 font-medium rounded-lg text-sm px-6 py-3 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Eregistrer</button>
                        </div>

                    </form>

                    <div class="container grid px-6 mx-auto">
                        <h2 class="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
                            Article Récemment Ajouter
                        </h2>
                        <!-- CTA -->


                        <!-- With avatar -->

                        <div class="w-full mb-8 overflow-hidden rounded-lg shadow-xs">
                            <div class="w-full overflow-x-auto">
                                <table class="w-full whitespace-no-wrap">
                                    <thead>
                                        <tr class="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                                            <th class="px-4 py-3">Nom de l'article</th>
                                            <th class="px-4 py-3">Prix Unitaire</th>
                                            <th class="px-4 py-3">Status</th>
                                            <th class="px-4 py-3">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody class="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                                        <tr class="text-gray-700 dark:text-gray-400">
                                            <td class="px-4 py-3">
                                                <div class="flex items-center text-sm">
                                                    <!-- Avatar with inset shadow -->

                                                    <div>
                                                        <p class="font-semibold">Hans Burger</p>

                                                    </div>
                                                </div>
                                            </td>
                                            <td class="px-4 py-3 text-sm">
                                                $ 863.45
                                            </td>
                                            <td class="px-4 py-3 text-xs">
                                                <span class="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full dark:bg-green-700 dark:text-green-100">
                                    En Stock
                                  </span>
                                            </td>
                                            <td class="px-4 py-3 text-sm">
                                                6/10/2023
                                            </td>
                                        </tr>




                                    </tbody>
                                </table>
                            </div>
                        </div>


                    </div>


                </div>
            </main>
</template>