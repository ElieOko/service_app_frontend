<script setup lang="ts">
import { ApiRoutes } from '@/utils/constant/endpoint';
import { dateConvert } from '@/utils/constant/fun';
import type { IArticle } from '@/utils/interface/IArticle';
import type { IStockRequest } from '@/utils/interface/IStock';
import { useAxiosRequestWithToken } from '@/utils/service/api';
import { ref, watchEffect } from 'vue';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { Loader } from '@progress/kendo-vue-indicators'

const type                  = "infinite-spinner"
const show                  = ref<any>(false)
// const  toggleLoader = () => {
show.value = show.value ? false : 'loader';
const stock = ref<IStockRequest>({
  article_fk:0,
  quantiteEntree :0,
  contenant : ""
})
show.value = false
const showLoad = ref<boolean>(false)
const tab = ["Cartons","Sac", "Autres"];
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
        showLoad.value = true
        const data = (JSON.parse(JSON.stringify(stock.value))) as IStockRequest ;
        if( data.article_fk == 0 || data.quantiteEntree == 0  || data.contenant == ""){
            notify("Certains champs sont vide");
            showLoad.value = false
            return
        }
        show.value = true
        await(useAxiosRequestWithToken().post(`${ApiRoutes.StockCreate}`,data)
            .then(function (response) {
                notify(response.data.message)
            })
            .catch(function (error) {
                console.log(error);
            })
            .finally(function () {
                //alert("Elie Oko");
                showLoad.value = false
                show.value = false
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
                        <div class="flex flex-wrap -mx-3 mb-2">
                          <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-state">
                                    Contenant
                                </label>
                                <div class="relative">
                                    <select v-model="stock.contenant" class="block appearance-none w-full border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state">
                                      <option v-for="item in tab" :value ="item">{{ item }}</option>
                                    </select>
                                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Ajouter au stock <svg v-if="showLoad" class="spinner inline h-6 w-6 mr-3" viewBox="0 0 4 4"></svg></button>
                    </form>

                  
                </div>
            </main>
            <div v-if="show" class="k-loader-container k-loader-container-md k-loader-top">
      <div class="k-loader-container-overlay k-overlay-dark" />
      <div class="k-loader-container-inner">
        <Loader :size="'large'" :type="type" />
      </div>
    </div>
</template>
<style>
  .spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #25353f;
  border-radius: 50%;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>