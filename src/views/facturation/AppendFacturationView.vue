<script lang="ts" setup>
import { ApiRoutes } from '@/utils/constant/endpoint';
import type { ICodeFacture } from '@/utils/interface/ICodeFacture';
import type { IFacturationRequest } from '@/utils/interface/IFacturation';
import type { IHistoriqueStockSortieRequest } from '@/utils/interface/IHistoriqueStockSortie';
import type { IStock } from '@/utils/interface/IStock';
import { useAxiosRequestWithToken } from '@/utils/service/api';
import { ref, watchEffect } from 'vue';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const facturation = ref<IFacturationRequest>({
    stock_fk : 0,
    quantite : 0,
    code_fk  : 0,
})

const notify = (msg:string) => {
      toast(msg, {
        autoClose: 8000,
      });
}
const code = ref<ICodeFacture>()
// const 
const stock = ref<Array<IStock>>()
    watchEffect(async()=>{
        await(useAxiosRequestWithToken().get(`${ApiRoutes.StockList}`)
            .then(function (response) {
              stock.value = response.data.stocks as Array<IStock>
              console.log( stock.value);
            })
            .catch(function (error) {
                console.log(error);
            })
            .finally(function () {
                //alert("Elie Oko");
            }));
    })    
const generate_code = async()=>{
    await(useAxiosRequestWithToken().get(`${ApiRoutes.CodeGenerate}`)
            .then(function (response) {
              code.value = response.data.facture_generate as ICodeFacture
                console.log( stock.value);
                notify("Votre code a été généré avec succès");
            })
            .catch(function (error) {
                console.log(error);
            })
            .finally(function () {
                //alert("Elie Oko");
            }));
}

const submit_facturation = async ()=>{
  const data = (JSON.parse(JSON.stringify(facturation.value))) as IFacturationRequest ;
  if(data.code_fk == 0 || data.quantite == 0 || data.stock_fk == 0){
    notify("Entrez les informations valides");
  }
  else{
    await(useAxiosRequestWithToken().post(`${ApiRoutes.facturationCreate}`,data)
            .then(function (response) {
                // notify(response.message as string);
            })
            .catch(function (error) {
               notify(error)
            })
            .finally(function () {
                //alert("Elie Oko");
            }));
  }

}
</script>
<template>
      <main class="h-full pb-16 overflow-y-auto">
                <div class="container grid px-6 mx-auto">
                   <div class="relative flex">
                        <div>
                            <h2 class="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
                                Sortie en stock Facturation
                            </h2>
                        </div>
                        <div class="absolute right-0">
                            <button @click="generate_code" type="button" class="text-white mt-5 bg-gray-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Generer un code</button>
                        </div>
                   </div>
                    <form class="w-full"  @submit.prevent="submit_facturation">
                        <div class="flex flex-wrap -mx-3 mb-2">
                          <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-state">
                                    Article dans le Stock
                                </label>
                                <div class="relative">
                                    <select v-model="facturation.stock_fk" class="block appearance-none w-full border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state">
                                      <option v-for="(item,index) in stock" :value ="item.id">{{ item?.article?.nom }}</option>
                                    </select>
                                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    </div>
                                </div>
                            </div>
                            <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-zip">
                          Quantité
                        </label>
                                <input v-model="facturation.quantite" class="appearance-none block w-full text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-zip" type="number" placeholder="90210">
                            </div>
                        </div>
                        <div class="w-full md:w-1/2 mb-6 md:mb-0">
                                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-state">
                                    Code Facturation
                                </label>
                                <div class="relative">
                                    <select v-model="facturation.code_fk" class="block appearance-none w-full border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state">
                                      <option  :value ="code?.id">{{ code?.nom }}</option>
                                    </select>
                                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    </div>
                                </div>
                            </div>
                        <button type="submit" class="text-white mt-5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Sortir au stock</button>
                    </form>
                </div>
            </main>

</template>