import post1 from './2020_02_10_hello_world'
import post2 from './2020_02_16_creating_a_gallery_component_in_react'
import post3 from './2020_05_25_about_business_logic'

const REQUIRED_PROPERTIES = ['title', 'slug', 'date', 'component', 'description']

const posts = [
  post1,
  post2,
  post3
]

// Yeah, I know, this is horrible.
// A better solution would be using TS and implemeting a Post interface to ensure no important properties are missing.
// But right now I'm not in the mood to figure out (again) how to setup TS, and honestly,
// I don't think I am going to have a noticeable performance drop because of doing a runtime validation.
const validate = post => {
  REQUIRED_PROPERTIES.forEach(prop => {
    if (post[prop] === undefined) {
      throw `Missing post property "${prop}"` // eslint-disable no-throw-literal
    }
  })

  // This validation would be hard to perform at compile time,
  // because I actually have no compile time aside from webpack build and babel transpile ¯\_(ツ)_/¯.
  // If Javascript had macros, I could easily implement a compile time validation using one.
  // Maybe a good excuse to try ClojureScript.
  if (posts.filter(p => p.slug === post.slug).length > 1) {
    throw 'Duplicated slug ' + post.slug // eslint-disable no-throw-literal
  }
}

posts.forEach(validate)

export default posts
