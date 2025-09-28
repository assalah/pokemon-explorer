# Pokémon Explorer

This application allows users to view a list of Pokémon available from the PokeAPI (https://pokeapi.co/docs/v2).

## Features

- Displays the name, image, and other details of each Pokémon.
- Filters the Pokémon list by type.
- Searches the Pokémon list by name.



## How to use

Run the following commands on Windows PowerShell:

```powershell
# Clone the repository
git clone https://github.com/assalah/pokemon-explorer.git

# Navigate into the project folder
cd pokemon-explorer


# Start the development server
bun dev
```
## project structure
src/

 ├─ lib/
 
 │   ├─ component/   # UI components (Card, styles) 
 
 │   └─ store/       # Search/filter store 
 
 ├─ routes/
 
 │   └─ +page.svelte # Main page
