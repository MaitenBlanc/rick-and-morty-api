import { RESTApi, Result } from "../models/api.interface";
import { Character } from "../models/character.model";

export class CharacterMapper {
  static mapApiCharacterToEntity(apiData: Result): Character {
    return {
      id: apiData.id,
      name: apiData.name,
      image: apiData.image,
      status: apiData.status,
      species: apiData.species,
      gender: apiData.gender,
      origin: {
        name: apiData.origin.name,
      },
      location: {
        name: apiData.location.name,
      },
      episode: apiData.episode,
    };
  }

  static mapApiCharactersToEntityArray(apiCharacters: Result[]): Character[] {
    return apiCharacters.map(char => this.mapApiCharacterToEntity(char));
  }


}
