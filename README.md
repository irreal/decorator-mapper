<!-- <p align="center">
  <img src="https://user-images.githubusercontent.com/1223799/50992071-73562500-1516-11e9-99fa-9f73b0f0eee2.png" width="597" alt="decorator-mapper">
</p> -->

# Decorator Mapper

> Map json (plain javascript objects/classes) to TypeScript classes using decorators

![](https://github.com/irreal/decorator-mapper/workflows/Node.js%20CI/badge.svg)
[![NPM version](https://img.shields.io/npm/v/@irreal/decorator-mapper.svg)](https://www.npmjs.com/package/@irreal/decorator-mapper)
![Downloads](https://img.shields.io/npm/dm/@irreal/decorator-mapper.svg)

---

## ✨ Features

- Use decorators to map a single field across different formats with different names
- Support any number of schemas, or sources. Optional for uses where you're only translating to/from a single schema.

## 🔧 Installation

```sh
npm install @irreal/decorator-mapper --save
```

## 🎬 Getting started

Here's an example to demonstrate usage:

say you have a model class such as:

```ts
class Employee {
  id: number = 0;
  name: string = "";
  department: string = "";
  active: boolean = true;
}
```

If you have a json object received from an API, a DB call, etc, which uses different names for fields, decorator mapper jumps in to help you out

let's say you call an API that returns:

```json
{
  "id": 1,
  "employeeName": "Mark Robinson",
  "sector": "Accounting",
  "employmentStatus": "active"
}
```

you can write a custom function mapping the names between your classes, but this gets tedious over time, especially when you work with multiple systems that each have their own 'schema'.

Decorator Mapper can automate this, as long as you tell it which field is which.

```ts
class Employee {
  id: number = 0;
  @field("employeeName")
  name: string = "";
  @field("sector")
  department: string = "";
  active: boolean = true;
}
```

Now, you can call into the provided mapper utility and convert to and from this format.

```ts
const apiData = {
  "id": 1,
  "employeeName": "Mark Robinson",
  "sector": "Accounting",
  "employmentStatus": "active"
};

const employee = Mapper.mapFromJson<Employee>(Employee, apiData);
// employee is an instance of the Employee class with the correct name, id and department copied over.
```

Notice how the id property didn't need a decorator since the name is the same in both 'schemas'.

The active property of our class is a more complicated case, where our class uses a boolean, the remote api might give us a string containing one of "active", "suspended", "terminated".

To handle this, we can use another decorator, denoting a custom function in our class where we can implement this specific logic directly.

```ts
class Employee {
  id: number = 0;
  @field("employeeName")
  name: string = "";
  @field("sector")
  department: string = "";
  active: boolean = true;
  @mapFunction()
  convertFromJson(data) {
    this.active = data.employmentStatus == "active";
  }
}
```

the mapper will now call our custom map function **after** mapping out individual properties, passing us the source data, allowing the function to adjust properties as needed.

note that in this case, we are introducing some data loss as our model does not support the full extent of the information provided by the other schema.

The mapper supports two way conversions, allowing us to easily convert an instance of our TypeScript class back into the other 'schema', using:

```ts
Mapper.mapToJson(instance); // does the conversion as described above, in reverse
```

To do any custom conversions when going from your class back to the outside schema, you can add another function and decorate it appropriately:

```ts
class Employee {
  id: number = 0;
  @field("employeeName")
  name: string = "";
  @field("sector")
  department: string = "";
  active: boolean = true;
  @mapFunction()
  convertFromJson(data) {
    this.active = data.empoymentStatus == "active";
  }
  @mapFunction(MapDirection.ToJson)
  convertToJson(mappedData) {
    //mappedData contains the plain object containing the data mapped so far by the automated field conversion, add or modify properties as needed

    mappedData.employmentStatus = this.active ? "active" : "terminated"  //watch out for the data loss we introduced when converting the string statuses into a bool in the above steps
  }
}
```

Lastly, in order to work with multiple data sources, all decorators, as well as mapper functions, support a secondary parameter indicating the 'schema' we are working with.

```ts
class Employee {
  id: number = 0;
  @field("employeeName") //fallsback to "default" schema
  @field("fullName", "database") // we are calling this schema database, it's any value we pick
  name: string = "";
  @field("sector")
  @field("dept", "database")
  department: string = "";
  active: boolean = true;
  @mapFunction()
  @mapFunction(MapDirection.FromJson, "database") //need to supply the otherwise default FromJson as the first parameter, in order to pass the second one indicating the source name
  convertFromJson(data, source) {
    if (source == "database") {
      this.active = data.empStatus;
    return;
    }
    this.active = data == "active";
  }
}
```

notice how we are receiving the "source" parameter in our custom convert function, then using it to branch out and map differently named columns.

If your conversion functions are more complex, it might be more readable to split them into two functions each with it's own decorator.

To use a named source for conversion, add it to the Mapper call:

```ts
Mapper.mapFromJson<Employee>(Employee, databaseData, "database");
```

<!-- ## 🎭 Examples

Go checkout [examples](./examples) ! -->

<!-- ## 📜 API

> Document your API here

### `publicMethodOne(value:string): string`

This methods does foo bar moo...

**Example:**

```ts
// example
```

## 🎓 Guides

<details>
<summary>How to do Foo</summary>
Today we're gonna build Foo....
</details>

### 🕵️ Troubleshooting -->

## 🥂 License

[MIT](./LICENSE.md) as always
