wunderground
============

       A Weather application built on Node.js and Express using  WeatherUnderGround api services .

       This  application  obtains weather data for Campbell, CA, Omaha, NE,  Austin, TX and Timonium, MD.

        Displays the weather results in a table and omit any locations that fail to return data.

        Create a middleware on the server‐side that will log to the console all parameters

        passed to the server via different methods of inputting data from a web app to the server (form, URL, etc).

For example :

         if the URL was http://localhost:8000/
         weather?name=foo it would log the fact that the name=foo was passed.

Approach Followed:

         1.Added rate limiting to the api , as api used here is a free service and it has limitation of 10 requests per minute
         2.Asynchronus calls to retrieve weather information  of the list of cities.[Tried using asynch and wait.for)
         3.Added functioality to add more default cities, with out chaging any implementation [ Add cities to listcities.json file , in the pattern
         specified in the file ,thus more cities can be added.
         4.Implemented middleware which will log every request made to the server



Instructions to use :


            npm install
            node index.js
            run bin/www.
            Browse to 'http://localhost:3000/weather/listcities'



Available api calls :

           1.  Request : /weather/listcities    ---- loads the populateweather page and loads weather forcast for default cities
           2.  Requesr : /weather/conditions?city=city_name&state=state_name  --- Loads the provided city and state forcast details onto table in page
