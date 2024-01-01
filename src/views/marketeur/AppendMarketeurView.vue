<script setup lang="ts">
import { ApiRoutes } from '@/utils/constant/endpoint';
import type { IMarketeurRequest } from '@/utils/interface/IMarketeur';
import { useAxiosRequestWithToken } from '@/utils/service/api';
import { ref, watchEffect } from 'vue';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const req = ref<IMarketeurRequest>({
  nom:""
}) 
    const notify = (msg:string) => {
      toast(msg, {
        autoClose: 8000,
      });
      }
    const submit_stock = async ()=>{
        const data = (JSON.parse(JSON.stringify(req.value))) as IMarketeurRequest ;
          if( data.nom == "" ){
            notify("Ce champ ne peut-être vide");
            return 
            }
        await(useAxiosRequestWithToken().post(`${ApiRoutes.MarketeurCreate}`,data)
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
                       Ajouter un Agent Marketeur
                    </h2>
                    <form class="w-full"  @submit.prevent="submit_stock">
                        <div class="flex flex-wrap -mx-3 mb-2">
                            <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-zip">
                          Nom Complet
                        </label>
                                <input v-model="req.nom" class="appearance-none block w-full text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-zip" type="text">
                            </div>
                        </div>
                        <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"> Enregistrer</button>
                    </form>

                    
                </div>
            </main>

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