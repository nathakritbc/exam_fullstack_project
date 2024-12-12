<script setup lang="ts">
import { useDisplay } from "vuetify";
import { ref, watch } from "vue";
import debounce from "lodash/debounce";
import PokemonService from "@/services/PokemonService";
import { toast } from "vue3-toastify";
import { AxiosResponse } from "axios";
import { Pokemon } from "@/types/Pokemon";
const { smAndDown } = useDisplay();
const search = ref("");
const loading = ref(false);
const fetchError = ref(false);
const pokemon = ref<Pokemon | null>(null);
const favorites = ref<string[]>([]);
const versions = ref<string[]>([]);
const KEY_FAVORITES = "KEY_FAVORITES";

const fetchPokemon = async (name: string) => {
  loading.value = true;
  fetchError.value = false;
  try {
    const { data, status }: AxiosResponse = await PokemonService.pokemonSearch(
      name
    );
    if (!data || status !== 200) {
      throw new Error("Pokemon not found");
    }

    pokemon.value = data;
    versions.value = data.game_indices.map((game: any) => game.version.name);
  } catch (error) {
    pokemon.value = null;
    fetchError.value = true;
    console.error(error);
    toast.error("Pokemon not found");
  } finally {
    setTimeout(() => {
      loading.value = false;
    }, 1000);
  }
};

const pokemonSprite = computed(() =>
  pokemon.value
    ? pokemon.value.sprites.other["official-artwork"].front_default
    : ""
);

const addFavorite = () => {
  if (pokemon.value && !favorites.value.includes(pokemon.value.name)) {
    const newList = [...favorites.value, pokemon.value.name];
    favorites.value = newList;
    localStorage.setItem(KEY_FAVORITES, JSON.stringify(newList));
  }
};

const removeFavorite = (name: string) => {
  const newList = favorites.value.filter((fav) => fav !== name);
  favorites.value = newList;
  localStorage.setItem(KEY_FAVORITES, JSON.stringify(newList));
};

const isFavorite = (name: string) =>
  favorites.value.includes(name.toLowerCase());

const debouncedSearch = debounce((query) => {
  fetchPokemon(query);
}, 500);

watch(search, (newValue) => {
  pokemon.value = null;
  loading.value = false;
  fetchError.value = false;
  if (!newValue) {
    return null;
  }

  debouncedSearch(newValue);
});

const initData = () => {
  try {
    const localFavorites = localStorage.getItem(KEY_FAVORITES);
    if (localFavorites) favorites.value = JSON.parse(localFavorites);
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  initData();
});
</script>

<template>
  <div>
    <!-- section1 -->
    <section class="w-full bg-gradient-to-r from-[#30A7D7] to-[#0E749D] pb-[110px]">
      <v-container>
        <v-img class="mt-16 mb-13" height="100" src="/logo.png" />
        <div
          class="border-4 border-[#FFCB05] rounded-[14px] bg-white shadow-xl"
          :class="[smAndDown ? 'mx-0 p-0' : 'mx-16']"
        >
          <div class="border-2 m-0.5 border-[#00729F] rounded-lg p-0 md:p-8">
            <v-card-text>
              <v-text-field
                v-model="search"
                label="Search"
                prepend-inner-icon="mdi-magnify"
                clearable
                maxlength="50"
                counter="50"
                variant="outlined"
                rounded="lg"
              ></v-text-field>

              <!-- loading -->
              <section
                v-show="loading"
                class="flex flex-col align-center justify-center min-h-[300px]"
              >
                <v-progress-circular
                  size="50"
                  indeterminate
                  color="#0E749D"
                ></v-progress-circular>
                <h1 class="text-xl font-semibold mt-7 mb-4">Sending Request</h1>
                <h4 class="font-light text-lg text-gray-400">Please wait...</h4>
              </section>
              <!-- loading -->

              <div v-if="!loading" class="mt-3">
                <!-- error -->
                <section
                  v-show="fetchError && search && !pokemon"
                  class="w-full mx-auto min-h-[300px] flex items-center justify-center"
                >
                  <h4 class="text-[#6F7794] font-semibold text-lg">
                    Not found
                  </h4>
                </section>
                <!-- error -->

                <!-- not error -->
                <section class="min-h-[300px]" v-show="!fetchError">
                  <div
                    v-if="pokemon && search && !fetchError"
                    class="w-full grid grid-cols-1 md:grid-cols-2 gap-10"
                  >
                    <section
                      class="w-full flex flex-row align-center justify-center bg-[#F5F7FB] rounded-lg p-6"
                    >
                      <img
                        width="240"
                        :src="pokemonSprite"
                        :alt="pokemon.name"
                      />
                    </section>
                    <section>
                      <div class="w-full flex align-center justify-between">
                        <h2 class="mt-4 text-3xl font-bold capitalize">
                          {{ pokemon.name }}
                        </h2>
                        <div
                          v-if="isFavorite(pokemon.name.toLowerCase())"
                          @click="removeFavorite(pokemon.name)"
                          class="flex rounded-full p-2 flex-row align-center cursor-pointer bg-[#FFF8DD] hover:bg-[#f8f0ce] active:bg-[#f5eaba]"
                        >
                          <v-icon size="30" color="#FFCB05">mdi-star</v-icon>
                        </div>
                        <div
                          v-else
                          @click="addFavorite"
                          class="flex rounded-full p-2 flex-row align-center bg-[#F5F7FB] cursor-pointer hover:bg-[#eaeef7] active:bg-[#d4dced]"
                        >
                          <v-icon size="30" color="#D7D9E1">mdi-star</v-icon>
                        </div>
                      </div>
                      <section class="mt-8 mb-6 grid grid-cols-2">
                        <div>
                          <h1 class="text-gray-500 font-semibold">Weight</h1>
                          <p class="text-lg text-gray-700">
                            {{ pokemon.weight / 10 }} kg
                          </p>
                        </div>
                        <div>
                          <h1 class="text-gray-500 font-semibold">Height</h1>
                          <p class="text-lg text-gray-700">
                            {{ pokemon.height }} cm
                          </p>
                        </div>
                      </section>
                      <div class="mt-4">
                        <h1 class="text-gray-500 font-semibold mb-3">
                          Versions
                        </h1>
                        <span
                          v-for="item in versions"
                          :key="item"
                          class="cursor-pointer inline-block px-3 py-2 m-1 text-sm font-semibold text-gray-700 bg-[#DBF5FF] rounded-full hover:bg-[#bfe9f9] active:bg-[#9cd7ef]"
                        >
                          {{ item }}
                        </span>
                      </div>
                    </section>
                  </div>

                  <div
                    v-show="!pokemon && !search && !fetchError"
                    class="w-full mx-auto min-h-[300px] flex items-center justify-center"
                  >
                    <h4 class="text-[#6F7794] font-semibold text-lg">
                      Try search for Pokémon by their name
                    </h4>
                  </div>
                </section>
                <!-- not error -->
              </div>
            </v-card-text>
          </div>
        </div>
      </v-container>
    </section>
    <!-- section1 -->

    <!-- section2 -->
    <section class="mt-10 pb-16">
      <v-container>
        <h3 class="text-2xl font-bold">Favorite</h3>

        <div
          class="w-full grid grid-cols-1 gap-2 md:grid-cols-2"
          v-if="favorites.length > 0"
        >
          <section
            class="flex flex-row align-center justify-between cursor-pointer pl-4 pr-3 py-1 bg-[#DBF5FF] hover:bg-[#d0f1fe] active:bg-[#ace0f5] rounded-md"
            v-for="(item, index) in favorites"
            :key="`${index}_${item}`"
            @click="search = item"
          >
            <span class="capitalize">{{ item }}</span>
            <v-btn
              @click="removeFavorite(item)"
              variant="text"
              color="black"
              icon="mdi-close"
            />
          </section>
        </div>

        <div v-show="favorites.length === 0">
          <h4 class="text-[#6F7794] font-semibold text-lg my-6 text-center">
            No favorite pokemon
          </h4>
        </div>
      </v-container>
    </section>
    <!-- section2 -->
  </div>
</template>

<style scoped></style>
