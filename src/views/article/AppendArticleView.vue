<script lang="ts" setup>
import { ApiRoutes } from '@/utils/constant/endpoint';
import type { IArticleRequest } from '@/utils/interface/IArticle';
import type { IDevise } from '@/utils/interface/IDevise';
import type { ITypeArticle } from '@/utils/interface/ITypeArticle';
import { useAxiosRequestWithToken } from '@/utils/service/api';
import { computed, ref, watchEffect } from 'vue';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { Loader } from '@progress/kendo-vue-indicators'

    const article = ref<IArticleRequest>({
        nom: "",
        prixUnitaire: 0,
        devise_fk: 0,
        price_big: 0,
        type_article_fk: 0
    });
    const type          = "infinite-spinner"
    const show          = ref<any>(false)
// const  toggleLoader = () => {
    show.value          = show.value ? false : 'loader';
    const showLoad      = ref<boolean>(false)
    show.value = false
    const devise        = ref<Array<IDevise>>()
    const errorArticleType = computed(() => {
      return article.value.type_article_fk === 0 || article.value.type_article_fk === "" ? "Entrez le type d'article" : "";
    });
    const errorNom = computed(() => {
      return article.value.nom === "" ? "Entrez un nom d'article valide" : "";
    });
    const errorDevise = computed(() => {
      return article.value.devise_fk === 0  ? "Entrez la devise" : "";
    });
    const type_article = ref<Array<ITypeArticle>>([])
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
    watchEffect(async()=>{
        await(useAxiosRequestWithToken().get(`${ApiRoutes.TypeArticleList}`)
            .then(function (response) {
                type_article.value = response.data.type_articles as Array<ITypeArticle> 
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
        showLoad.value =  true
        const data = (JSON.parse(JSON.stringify(article.value))) as IArticleRequest ;
        if( data.devise_fk == 0){
            notify("Selectionné la devise");
            showLoad.value = false
            return
        }
        if( data.nom == ""){
            notify("Selectionné le nom");
            showLoad.value = false
            return
        }
        if( data.price_big == 0  && data.prixUnitaire == 0){
            notify("Précisez le prix de ventes de la marchandise");
            showLoad.value = false
            return
        }
        show.value = true
        await(useAxiosRequestWithToken().post(`${ApiRoutes.ArticleCreate}`,data)
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
                <div class="container px-6 mx-auto grid">
                    <h2 class="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
                        Ajouter des Marchandises dans le système
                    </h2> 
                    <form  @submit.prevent="submit_new_article" class="w-full max-w-full p-4 z-10 py-4 bg-white shadow-md dark:bg-gray-800">
                            <div class="w-full mb-4">
                                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                            Nom de L'article
                          </label>
                                <input v-model="article.nom" class="appearance-none block w-full text-gray-700 border border-gray-200  rounded py-3 px-4 leading-tight focus:outline-none  focus:bg-white" id="grid-name" type="text" placeholder="ex:Riz">
                                <label class="text-red-500" v-if="errorNom">{{ errorNom }}</label>
                            </div>
                        <div class="flex flex-wrap -mx-3 mb-6">
                            <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                            Prix de Vente Grossiste
                          </label>
                                <input v-model="article.price_big" step="0.01" min="0" max="250000" class="appearance-none block w-full text-gray-700 border border-gray-200  rounded py-3 px-4 leading-tight focus:outline-none  focus:bg-white" id="grid-name" type="number" >
                            </div>
                            <div class="w-full md:w-1/2 px-3">
                                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-last-name">
                            Prix de Vente Detaillant
                          </label>
                                <input v-model="article.prixUnitaire" step="0.01" min="0" max="250000" class="appearance-none block w-full  text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-last-name" type="number"  >
                                <!-- <label class="text-red-500" v-if="errorPrix">{{ errorPrix }}</label> -->
                            </div>
                        </div>
                        <div class="flex flex-wrap -mx-3 mb-6">
                            <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
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
                            <div class="w-full md:w-1/2 px-3">
                                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-devise">
                                    Type d'Article
                                </label>
                                <div class="relative">
                                    <select v-model="article.type_article_fk" class="block appearance-none w-full  border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-devise">
                                        <option v-for="(item, index) in type_article" :value="(item.id as number)">{{ item.nom }}</option>
                                    </select>
                                    <label class="text-red-500" v-if="errorArticleType">{{ errorArticleType }}</label>
                                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        
                        <div class="w-full md:w-1/2 mt-6 px-3">
                            <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-1 focus:ring-blue-300 font-medium rounded-lg text-sm px-6 py-3 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                                Sauvegarder  <svg v-if="showLoad" class="spinner inline h-6 w-6 mr-3" viewBox="0 0 4 4"></svg>
                           </button>
                        </div>

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