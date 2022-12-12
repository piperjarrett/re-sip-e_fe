import NavBar from "../NavBar/NavBar";
import "./CocktailInfo.css";
import { Button, Heading, Spinner } from "@chakra-ui/react";
import { useQuery, gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import EditCocktail from "../EditCocktail/EditCocktail";

const CocktailInfo = ({ cocktailId, checkBar }) => {


  const apiDrink = gql`
        query {
          apiDrink(id: ${cocktailId}){
            id
            name
            steps
            imgUrl
            ingredients {
             description 
            }
          }
        }
          `;
  const barDrink = gql`
    query {
      drink(id: ${cocktailId}) {
            id
            name
            imgUrl
            steps
            bar {
              id
              name
            }
            ingredients {
              id
              description
            }
        }
      }
    
          `;

  const SEND_NEW_DRINK = gql`
    mutation ($input: DrinkCreateInput!) {
      drinkCreate(input: $input) {
        drink {
          id
          name
          steps
          imgUrl
          ingredients {
            id
            description
          }
        }
      }
    }
  `;

  const { loading, error, data } = useQuery(checkBar ? barDrink : apiDrink);

  const [addDrink] = useMutation(SEND_NEW_DRINK);
  const addToBar = () => {
    const removeTypeName = data.apiDrink.ingredients.map((ingredient) => {
      return {
        ...ingredient,
        __typename: undefined,
      };
    });
    const newDrinkToAdd = {
      name: data.apiDrink.name,
      steps: data.apiDrink.steps,
      imgUrl: data.apiDrink.imgUrl,
      barId: 1,
      ingredients: removeTypeName,
    };
    addDrink({
      variables: {
        input: { drinkInput: newDrinkToAdd },
      },
    });
  };
  return loading ? (
    <Spinner />
  ) : (
    <div>
      <NavBar />
      <div className="cocktail-details">
        <Heading as="h1" size="4xl">
          {data.apiDrink ? data.apiDrink.name : data.drink.name}
        </Heading>
        <h2>{`Steps: ${
          data.apiDrink ? data.apiDrink.steps : data.drink.steps
        }`}</h2>
        <img src={data.apiDrink ? data.apiDrink.imgUrl : data.drink.imgUrl} />
        <h3>
          {data.apiDrink
            ? data.apiDrink.ingredients.map((ingredient) => {
                return ingredient.description;
              })
            : data.drink.ingredients.map((ingredient) => {
                return ingredient.description;
              })}
        </h3>

        {checkBar ? (
          <EditCocktail choosenCocktail={data.drink} />
        ) : (
          <Button onClick={() => addToBar()}>Add to my bar!</Button>
        )}
      </div>
    </div>
  );
};

export default CocktailInfo;
