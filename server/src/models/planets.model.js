const fs = require("fs");
const path = require("path");
const parse = require("csv-parse");
const planets = require("./planets.schema");

function isHabitablePlanet(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}

// ReadStream -> pipe - writable Stream
// readable.pipe(writable)

function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, "..", "..", "data", "kepler_data.csv")
    )
      .pipe(
        parse({
          comment: "#",
          columns: true, //parser with options to ignore lines starting with '#' and treat the first row as column headers. returns each row as a javascript object
        })
      )
      .on("data", async (data) => {
        if (isHabitablePlanet(data)) {
          // habitablePlanets.push(data);
          savePlanet(data);
        }
      })
      .on("error", (err) => {
        console.log(err);
        reject(err);
      })
      .on("end", async () => {
        const countPlanetsFound = (await getAllPlanets()).length;
        console.log(`${countPlanetsFound} habitable planets found!`);
        resolve();
      });
  });
}

async function getAllPlanets() {
  return await planets.find(
    {},
    {
      _id: 0,
      __v: 0,
    }
  ); //returns all the planets, if any filter is applied than it returns that particular document second query is used to exclude the particular data
}

async function savePlanet(planet) {
  //updateOne is used to update only one Document
  //upsert = insert + update;
  //upsert :  first check if document exist in the collection if it's not then update it, if its exist then update with same value
  try {
    await planets.updateOne(
      {
        keplerName: planet.kepler_name,
      },
      {
        keplerName: planet.kepler_name,
      },
      {
        upsert: true,
      }
    );
  } catch (err) {
    console.error(err);
  }
}
module.exports = {
  loadPlanetsData,
  getAllPlanets,
};
