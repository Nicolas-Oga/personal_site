import React from 'react'

import Typography from '@material-ui/core/Typography'

import A from '../../components/InlineHyperLink'
import P from '../../components/Paragraph'
import PostSectionTitle from '../../components/PostSectionTitle'
import Gallery from '../../components/Gallery'
import Figure from '../../components/Figure'
import CodeSandboxIframe from '../../components/CodeSandboxIframe'

import cover from './cover.png'

import dice from './dice.jpg'
import bycicle from './bycicle.jpg'
import toyCar from './toy-car.jpg'
import mountain from './mountain.jfif'

import mockup1 from './mockup-1.png'
import mockup2 from './mockup-2.png'

const IMAGES = [dice, bycicle, toyCar, mountain]

const Post = _props => {
  return <Typography variant='body1' component='div'>
    <P>
      Hey there.
    </P>

    <P>
      There&apos;s a chance you took a look at the <A href='/about-me'>About Me</A> section of this site. There I use this component to show images:
    </P>

    <Gallery images={IMAGES} />

    <P>
      This is what I wanted to talk about today.
      Of course, if you needed a component like this, you could go and grab one of the open-source components available at NPM.
      <A external href='https://www.npmjs.com/package/react-image-gallery'>react-photo-gallery</A> looks like a solid choice.
    </P>

    <P>
      But let&apos;s face it: I love over and reverse engineering stuff.
      Everybody knows that tinkering is the best way to get familiar with tools, and that also applies to software.
      You can buy a ready-to-use solution at the store, or try to build it at home and learn something new while doing it.
    </P>

    <P>
      Even if you are doing serious work for a real company, building from scratch can be a viable option.
      Design teams often hand precise requirements which need to be implemented in pixel-perfect fashion.
    </P>

    <P>
      On this scenario, you have two options: try to use a 3rd party package and tinker with it to look like the way it should, or implement everything from scratch.
      The latter tends to be the right choice more often than you would think.
    </P>

    <P>
      Wrapping up, the point of this post is to be educational, not practical. So let&apos;s get hands-on building this thing.
    </P>

    <PostSectionTitle>What are we building</PostSectionTitle>

    <P>
      The gallery we are going to build consists of two main parts: the panner or &quot;film strip&quot; that displays the images, and a fullscreen overlay that allows taking a close look at the images.
    </P>

    <P>
      Features of the panner:
    </P>

    <ul>
      <li>Displays a dynamic amount of images.</li>
      <li>If images overflow horizontally, can be paned by hovering on the sides or dragging. This is why I call it panner</li>
      <li>Can also be panned using touch, friendly for mobile phones.</li>
      <li>When you click on an image, a fullscreen overlay is shown</li>
    </ul>

    <Figure src={mockup1} caption='The panner' />

    <P>
      Features of the fullscreen overlay:
    </P>

    <ul>
      <li>It displays clicked image</li>
      <li>It displays the entire list of images in the gallery, using the same panner component we use for the passive inline gallery.</li>
      <li>
        Allows navigating through all the images in the gallery by multiple input methods:
        <ul>
          <li>by using the two little arrows on the sides</li>
          <li>by swiping to the left or right</li>
          <li>by clicking on the images in the image list</li>
          <li>by using the arrow keys</li>
        </ul>
      </li>
      <li>Can be closed using a little &quot;X&quot; on the corner or by hitting the Escape key</li>
    </ul>

    <Figure src={mockup2} caption='The fullscreen overlay' />

    <P>
      It is worth mentioning that you can have multiple galleries on the same page and they should work correctly.
      There&apos;s going to be a single overlay component, shared by all gallery instances.
    </P>

    <PostSectionTitle>The panner</PostSectionTitle>

    <P>
      This component is going to display the images statically, before any user input.
      We need it to have a set height, and it will be pan-able by all the methods mentioned before.
    </P>

    <P>
      A poor man&apos;s version of this component would be a simple, scrollable div with a set height.
    </P>

    <CodeSandboxIframe slug='styled-components-d942z' caption="Poor Man's Panner" />

    <P>
      We take advantage of the behaviour of <code>{'<img />'}</code>,
      i.e., that when one of its dimensions is set (width, or height) the other one adjusts to keep the original aspect ratio of the image.
    </P>

    <P>
      This is somewhat usable, but it looks awful. We need to ditch that scrollbar and begin over-engineering to make it look nice.
      We&apos;ll start by making it pan using mouse drag.
    </P>

    <CodeSandboxIframe slug='poor-mans-panner-5guoq' caption='Draggable Panner' />

    <P>
      Nice, that looks a lot better already. We used a combination of mouse events to control the scrolling. <code>onMouseDown</code>, <code>onMouseUp</code> and <code>onMouseLeave</code> tells us whether the user is current dragging on the container.
      Comparing the &quot;x&quot; coordinate of the <code>onMouseMove</code> event against the last known &quot;x&quot; position gives us the number of pixels that the user moved the mouse on the last &quot;tick&quot; of this event.
      We can sum this amount to the element&apos;s <code>scrollLeft</code> property to achieve the scrolling effect we want.
    </P>

    <P>
      I specified <code>{'onDragStart={ev => ev.preventDefault()}'}</code> for the images to disable the default drag-and-drop behavior.
    </P>

    <P>
      Also note the usage of <code>useRef</code> hook. We could get away with using regular variables because our component is not going to re-render.
      But as soon as we introduce changes that cause a re-render, we are bound to run into problems, as local variables are going to be reset.
      By using a ref, we make sure we don&apos;t lose our state.
    </P>

    <P>
      So that&apos;s it for dragging. We are still missing hover and swipe.
      Keep in mind that our component is soon going to begin bloating because of three different behaviours being present.
      We&apos;ll need to deal with that bloat later.
    </P>

    <PostSectionTitle>Adding scroll by hover</PostSectionTitle>

    <P>
      We&apos;ll add two little divs on the sides with arrow icons, that will begin scrolling the container into the appropriate direction when hovered.
      I&apos;ll call these &quot;pan controls&quot;.
    </P>

    <P>
      We&apos;ll use absolute positioning to display the pan controls on top of the images.
      There&apos;s an unexpected behaviour with absolute positioning that we&apos;ll need to deal with.
      See how the pan controls are scrolled alongside the images on this failed example.
      I made the pan controls pop-up using an ugly background colour:
    </P>

    <CodeSandboxIframe slug='failed-hoverable-panner-pux21' caption='Failed Hoverable Panner' height='400px' view='preview' />

    <P>
      We need our pan controls to not be children of a scrollable div.
      To fix this, we&apos;ll need to render the scrollable content inside another wrapper element,
      while the pan controls remain to be children of the root element.
    </P>

    <CodeSandboxIframe slug='fixed-hoverable-panner-n61p1' caption='Fixed Hoverable Panner' />

    <P>
      Fixed. Now let&apos;s add the hover behaviour.
      We&apos;ll use <code>onMouseEnter</code> and <code>onMouseLeave</code> to start and stop the scrolling in the given direction.
    </P>

    <CodeSandboxIframe slug='hoverable-panner-bh628' caption='Actually Hoverable Panner' />

    <P>
      Good job, we already have scroll on hover. We&apos;ll take care of making these pan controls look nice later.
      But right now we have more pushing problems. The component is already bloated.
      We&apos;ll try to separate concerns and better encapsulate the code that enables each behaviour.
    </P>

    <PostSectionTitle>Separating concerns</PostSectionTitle>

    <P>
      To continue with the trend, we&apos;ll create a custom hook for each of our behaviours.
      Let&apos;s call them <code>useDragScroll</code> and <code>useHoverScroll</code>.
    </P>

    <P>
      Creating custom hooks is more straightforward than you might think.
      The thing I love about react and the direction they took in the last years, is that everything boils down to using the language features.
      Hooks are just functions. Let&apos;s get to it.
    </P>

    <CodeSandboxIframe slug='refactored-hoverable-panner-0djk3' caption='Refactored Draggable Hoverable Panner' module='/Panner/index.jsx' />

    <P>
      Ah, so much better. What a fantastic change it can be to move stuff under the carpet.
      But seriously, now that each behaviour is separated into a different file, we can easily test them in isolation.
      That&apos;s the spirit of good unit testing.
      Also -although here we won&apos;t need it- isolation means that we can re-use these hooks wherever it makes sense.
    </P>

    <P>
      If you are familiar with enhancer functions or higher-order components, this is not much different.
      Instead of receiving stuff via props, we can simply use the language&apos;s elemental features and ditch the &quot;prop passing dance&quot;.
      I will probably talk about this typical dance on another post.
    </P>

    <P>
      I even moved the styled-components into a separate file. This is a common practice.
      Styled components are behaviour poor code that need not clutter our main component source code.
      Additionally, this way, we can easily share the styled-components between other auxiliar sub-components.
    </P>

    <P>
      We are almost there. Now that we established a pattern to add more behaviour to our component without cluttering it, let&apos;s keep moving.
    </P>

    <PostSectionTitle>Adding swipe scroll behavior</PostSectionTitle>

    <P>
      Very similarly to how we solved drag, we are going to compare the &quot;x&quot; coordinate of <code>onTouchMove</code> events and add the delta to the film strip&apos;s <code>scrollLeft</code> property.
      Once again, let&apos;s create a custom hook called <code>useSwipeScroll</code> to encapsulate the needed code.
    </P>

    <CodeSandboxIframe slug='swipeable-hoverable-draggable-panner-xrlkm' caption='Swipeable Draggable Hoverable Panner' module='/Panner/index.jsx' />

    <P>
      Not much to comment, it works!
      Let&apos;s make this thing look pretty by using some icons and hiding the hoverable divs when not needed.
      Also, let&apos;s make a proper Gallery component that builds on top of the Panner.
      It will accept the whole array of image sources and iterate over them, so we don&apos;t have to.
    </P>

    <CodeSandboxIframe slug='pretty-panner-mhmyi' caption='Pretty Panner' module='/Gallery.jsx' view='preview' height='400px' />

    <P>
      Perfecto! In my humble opinion, this component already looks and feels fantastic.
      I&apos;ve borrowed icons from Material-UI, then hid the pan controls when not needed by setting its opacity to zero.
      Also, I&apos;ve specified some cursors for the final touch.
    </P>

    <P>
      In order for my component to re-render in reaction to changes in <code>scrollLeft</code>, I used the <code>useState</code> hook and <code>onScroll</code> event.
    </P>

    <P>
      Congratulations.
      That was a lot of work, but we now have an excellent <code>Panner</code> component, and it will be double useful later, you&apos;ll see.
      Keep it up, we are on the right track!
    </P>

    <PostSectionTitle>The fullscreen gallery</PostSectionTitle>

    <P>
      The whole purpose of this component was to have a zoomed-in view of our images.
      Here comes into play the fullscreen gallery.
    </P>

    <P>
      First things first, we&apos;ll need a platform to display our fullscreen gallery at.
      This would be a simple fixed div that shows on top of the entire page.
    </P>

    <P>
      Remember I said we could have multiple galleries on the page and they should work correctly?
      For this, we&apos;ll need them to share usage of the same fullscreen gallery.
      Inline gallery components across the page should all be able to trigger the full-screen gallery to display, passing the image list and currently selected image.
      This can be tricky, though, as React is very protective of component&apos;s state.
      We&apos;ll get to the chosen solution soon enough. Spoiler alert: it involves the usage of React contexts.
    </P>

    <P>
      So let&apos;s start by creating the component that will represent the full-screen gallery.
    </P>

    <CodeSandboxIframe slug='useless-full-screen-overlay-390yf' caption='Useless Full Screen Gallery' module='/F>ullScreenGallery.jsx' view='preview' />

    <P>
      Here it is. A big dumb fullscreen gallery component.
      I borrowed icons from MaterialUI again and sprinkled some markup to make it work.
      The <code>Panner</code> component we built before became useful again as a means to display the list of images.
    </P>

    <P>
      The rest of the page didn&apos;t go away, I just rendered the fullscreen gallery on top of it.
      It does not have any kind of dynamic behaviour. It&apos;s open by default, can&apos;t be closed, and the images are hardcoded.
      We need it to open when an image on a gallery is clicked, passing the clicked image as <code>currentImage</code> and all the images in the clicked gallery as <code>images</code>.
    </P>

    <P>
      Let&apos;s get into that global state management.
    </P>

    <PostSectionTitle>Making the FullScreenGallery available to all the Gallery components in the page</PostSectionTitle>

    <P>
      We&apos;ll make usage of a typical pattern among libraries in React: the context provider.
      This component will provide access to functions that control the FullScreenGallery state to any component in its descendants.
    </P>

    <P>
      The provider will take your whole application as a children and render it inside a regular <code>Context.Provider</code>, created with <code>React.createContextProvider</code>.
      We will also render the <code>FullScreenGallery</code> itself. For shortness, I&apos;ll call it <code>GalleryProvider</code>.
    </P>

    <CodeSandboxIframe slug='introducing-the-galleryprovider-zs0i1' caption="The GalleryProvider" module='/GalleryProvider.jsx' view='editor' />

    <P>
      Here is our provider.
      Note that this component is stateful and we are passing the <code>active</code> prop to the <code>FullScreenGallery</code> component.
      We could also just write something like <code>{'{active && <FullScreenGallery ... />}'}</code>, but this way the <code>FullScreenGallery</code> will know about being active or not, and will be able to implement any kind of in/out animation.
      Let&apos;s wrap our component tree with this provider and wire the <code>Gallery</code> component to have access to it&apos;s goodies via the <code>useFullScreenGallery</code> hook.
    </P>

    <CodeSandboxIframe slug='introducing-the-galleryprovider-crlud' caption="Wiring the Gallery component" module='/Gallery.jsx' />

    <P>
      Starting to look functional already. When you click on an image on the gallery, it triggers the <code>FullScreenGallery</code> to show.
      For demonstration purposes, I&apos;ve added a second gallery to show how they share the usage of the fullscreen gallery.
      We are missing some behaviour yet, because the <code>FullScreenGallery</code> can&apos;t be closed, and we can&apos;t navigate through the images on it.
      Let&apos;s wire the close button, the prev/next buttons and the <code>onClick</code> handler for the images on the strip.
    </P>

    <CodeSandboxIframe slug='wiring-the-fullscreengallery-controls-boq0r' caption="Wiring the FullScreenGallery controls" module='/FullScreenGallery/index.jsx' />

    <P>
      That&apos;s it. We are finished. My version of the full-screen gallery also has keyboard and swipe support, but this post got really long already.
      In any case, you can implement those on your own following the same pattern for organizing behaviour we used for the Panner.
      There&apos;s also still a good opportunity for refactor and better code organization here, but I think we did a pretty good job so far.
    </P>

    <P>
      I hope you found this little big tutorial helpful or even enlightening.
      If you have any constructive input, comments or suggestions, I would love to hear about them. Use the comments section beneath!
    </P>
  </Typography>
}

const post = {
  // Here "1" stands for February. Initially I put "2", but I was seeing March when displaying the date.
  // Took me some time to understand what was happening. This is why I love-hate JS.
  cover,
  date: new Date(2020, 1, 16),
  plainTextTitle: 'Creating a gallery component with react and styled-components',
  title: <>Creating a gallery component with react and <nobr>styled-components</nobr></>,
  description: 'Step by step guide',
  component: Post,
  slug: 'creating-a-gallery-component-with-react',
  tags: ['react', 'software'],
}

export default post
