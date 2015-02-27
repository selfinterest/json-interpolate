# json-interpolate

Basically, a service that allows you to inject one JSON file into another.

Suppose `mainFile.json` contains:

    {
       "name": "Terrence",
       "cats": "{{ import 'cats.json' }}"
    }
   
And `cats.json` contains:

    [ "Senea", "Amala", "Herbie", "Agnes" ]

Then loading `mainFile.json` into a string and running `interpolate.parse()` on it will get you:

    {
        "name": "Terrence",
        "cats": ["Senea", "Amala", "Herbie", "Agnes"]
    }

The idea is to run the interpolator before you send the string to `JSON.parse()`.

That's all for now!
        