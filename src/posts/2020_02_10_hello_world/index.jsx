import React from 'react'
import styled from 'styled-components'

import P from '../../components/Paragraph'
import InlineHyperLink from '../../components/InlineHyperLink'
import PostSectionTitle from '../../components/PostSectionTitle'
import Thumbnail from '../../components/Thumbnail'

import oldBlog from './old-blog.png'

const A = styled(InlineHyperLink).attrs({ external: true })``

const Post = _props => (
  <div>
    <P>
      Today is a great day.
    </P>

    <P>
      If you are reading this, it means that my blog is finally online.
    </P>

    <P>
      As a software developer, I should have created one long time ago. And in fact, I did. This is how it looked until just a few moments before I replaced  it with this new one:
    </P>

    <Thumbnail src={oldBlog} />

    <P>
      If you gagged, I&apos;d understand. Like most kids, I had a lot of imagination back then (I think I still do), but my taste was not very refined. This time I went for a super minimalistic look. I understand that less is more, especially when you have no idea about design.
    </P>

    <P>
      So let me talk a little about the ingredients that went into the making of this masterpiece.
    </P>

    <PostSectionTitle>How I built it</PostSectionTitle>

    <P>
      I chose to build this page as a <A href='https://reactjs.org/'>React</A> single page application. Yeah, I know, overkill.
      The case is that a plain static site is boring. And I would have needed some framework like <A href='https://jekyllrb.com/'>Jekyll</A> or <A href='https://middlemanapp.com/'>Middleman</A> anyway to remove code duplication and make my life easier.
    </P>

    <P>
      Since I planned to write some blog posts about React, I supposed that it wasn&apos;t a bad idea to actually have the whole site built with it. Then I wouldn&apos;t need to do anything special to be able to show code examples. Nice excuse!
    </P>

    <P>
      Other ingredients I threw into the recipe are <A href='https://github.com/ReactTraining/react-router'>react-router</A>, <A href='https://styled-components.com/'>styled-components</A> and <A href='https://material-ui.com/'>Material-UI</A>.
      React-router is self-explanatory.
      Styled components are the best tool I know to add (real) CSS to React components.
      And I took as many components as I could from Material-UI because I&apos;m lazy (in the good way, I swear!), and they look good.
      If you are curious, here is the <A href={process.env.FRONT_SOURCE_CODE_URL}>source code</A>.
      If you decided to reuse the scaffold to build your own site I&apos;d be flattered, but please mention me :), that helps.
    </P>

    <PostSectionTitle>Why I built it</PostSectionTitle>

    <P>
      When I built my first blog, I wanted to promote myself as a developer.
      That is still my primary motivation or excuse today.
      Nowadays I feel like I have more to offer than back then, but never actually sat down and invested time into making a &quot;good&quot; blog.
      Not having a stablished platform for blogging kept me from posting anything useful on the web for a long time.
      This blog is supposed to change that.
    </P>

    <P>
      I feel like once this thing is rolling, I will be posting a lot, or at least regularly. I hope that enthusiasm does not fade away, like the one I had for some of my hobbies, activities and projects.
    </P>

    <P>
      Also, if you ever wrote anything, you may have noticed that it can be very therapeutic. It helps you organize your ideas, and I also learned a lot by putting this little blog up. You can say a lot of things while under the illusion that no one is listening.
    </P>

    <P>
      So if you are reading this, I highly recommend you to write your own blog.
      It does not matter how many people read it. There&apos;s value in the simple act of writing it.
    </P>

    <PostSectionTitle>
      What can you expect from this blog
    </PostSectionTitle>

    <P>
      I&apos;ll be posting about software, mostly practical stuff. I&apos;ll also be posting about general stuff, once I find out what to talk about. Like most humans, I&apos;m interested in a lot of things, so who knows what the next topic will be.
    </P>

    <P>
      In any case, thank you for reading so far. With these words, I hereby declare this site inaugurated, see you in the next post!
    </P>
  </div>
)

const post = {
  // Here "1" stands for February. Initially I put "2", but I was seeing March when displaying the date.
  // Took me some time to understand what was happening. This is why I love-hate JS.
  date: new Date(2020, 1, 10),
  title: 'Hello World',
  description: 'Let me introduce you to this little site',
  component: Post,
  slug: 'hello-world'
}

export default post
