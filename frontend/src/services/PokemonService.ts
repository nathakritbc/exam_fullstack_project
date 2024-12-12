import axios from "axios";
import { AxiosResponse } from "axios";
const PATH = "https://pokeapi.co/api/v2/pokemon";
const pokemonSearch = async (name: string): Promise<AxiosResponse> => {
  return await axios.get(`${PATH}/${name.toLowerCase()}`);
};

const PokemonService = {
  pokemonSearch,
};

export default PokemonService;
