<script setup lang="ts">
import { ApiRoutes } from '@/utils/constant/endpoint';
import type { IDevise } from '@/utils/interface/IDevise';
import { useAxiosRequestWithToken } from '@/utils/service/api';
import { ref, watchEffect } from 'vue';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const devise = ref<Array<IDevise>>([])
const deviseRequest = ref<IDevise>({
  taux:0
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
    const notify = (msg:string) => {
      toast(msg, {
        autoClose: 8000,
      });
      }
    const submit_stock = async ()=>{
        const data = (JSON.parse(JSON.stringify(deviseRequest.value))) as IDevise ;
        if( data.taux == 0 ){
            notify("Certains champs sont vide");
            return
        }
        await(useAxiosRequestWithToken().post(`${ApiRoutes.DeviseUpdate}/${1}`,data)
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
  <div class="flex flex-wrap -mx-6">
    <div class="w-full px-6 mt-6 sm:w-1/2 xl:w-1/3 sm:mt-0">
          <div
            class="flex items-center px-5 py-6 hover:bg-green-200 bg-white rounded-md shadow-sm"
          >
            <div class="p-3 bg-gray-600 bg-opacity-75 rounded-full">
              <svg
              class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20"
              >
              <path
              d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"
            />
            <path
              fill-rule="evenodd"
              d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
              clip-rule="evenodd"
            />
              </svg>
            </div>

            <div class="mx-5">
              <h4 class="text-2xl font-semibold text-gray-700">
                Taux du jour
              </h4>
              <div class="text-gray-500">
               {{ devise[0]?.taux}}
              </div>
            </div>
          </div>
    </div>
  </div>
  <main class="h-full pb-16 overflow-y-auto">
                <div class="container grid px-6 mx-auto">
                    <h2 class="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
                       Devise
                    </h2>
                    <form class="w-full"  @submit.prevent="submit_stock">
                        <div class="flex flex-wrap -mx-3 mb-2">
                            <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-zip">
                          Taux
                        </label>
                                <input v-model="deviseRequest.taux" value="122" class="appearance-none block w-full text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-zip" type="number" placeholder="90210">
                            </div>
                        </div>
                        <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"> Changer</button>
                    </form>

                    
                </div>
            </main>

</template>