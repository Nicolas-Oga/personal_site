import React from 'react'
import Typography from '@material-ui/core/Typography'

import PostSectionTitle from '../../components/PostSectionTitle'
import P from '../../components/Paragraph'
import Highlight from '../../components/Highlight'
import HL from '../../components/InlineHyperLink'
import CodeSample from '../../components/CodeSample'

const REFERENCES = {
  wikipedia: 'https://en.wikipedia.org/wiki/Business_logic',
  trailblazer: 'http://trailblazer.to',
  activeinteraction: 'https://github.com/AaronLasseigne/active_interaction',
  mutations: 'https://github.com/cypriss/mutations',
  commandObject: 'https://en.wikipedia.org/wiki/Command_pattern'
}
  

const Post = _props => {
  return (
    <Typography variant='body1' component='div'>
      <PostSectionTitle>
        What is business logic, exactly
      </PostSectionTitle>

      <P>
        Quoting <HL external href={REFERENCES.wikipedia}>Wikipedia</HL>:
      </P>

      <Highlight>
        In computer software, business logic or domain logic is the part of the program that encodes the real-world business rules that determine how data can be created, stored, and changed.
        <br/>
        It is contrasted with the remainder of the software that might be concerned with lower-level details of managing a database or displaying the user interface, system infrastructure, or generally connecting various parts of the program.
      </Highlight>

      <PostSectionTitle>
        A first approach to organizing business logic
      </PostSectionTitle>

      <P>
        To date, the Model-View-Controller pattern could be considered the most popular pattern in the web world.
      </P>

      <P>
        The parts in MVC generally mean:
      </P>

      <ul>
        <li>
          <strong>Model:</strong> a class or service that enables interaction with a particular data collection.
        </li>
        
        <li>
          <strong>Controller:</strong> a class or service that handles a particular set of requests to our server.
        </li>

        <li>
          <strong>View:</strong> a template with embedded language expressions, like ERB or Jade (now Pug).
        </li>
      </ul>

      <P>
        This pattern feels natural in the development of server-side sites.
        It meant to describe the inner workings of an HTTP server.
        A thin layer that resides at the edge of a larger software contraption.
        Yet, many of us would end organizing the entire codebase around MVC, which lead to some problems.
      </P>

      <P>
        Two of these problems are fat controllers and fat models.
        We would realize that these exploded with code that didn’t seem to belong there.
        Then we would begin to look for ways to refactor that logic away, after the damage was done.
        Some of that logic may be presentational logic. Some may be business logic.
      </P>

      <P>
        The problem has something to do with the name “Models”.
        It conveys the idea that our system’s business logic model should live in them.
        But models' original purpose was not that.
        It was to validate and store data.
      </P>

      <P>
        Further, we live in an era were single page sites and mobile apps are the norm.
        New approaches to developing HTTP APIs like GraphQL are very popular.
        In this reality, the "View" and "Controller" in MVC become less and less relevant.
      </P>

      <P>
        If we go back to Wikipedia's definition of business logic, we begin to notice a few things:
      </P>

      <ul>
        <li>
          MVC models are actually low-lovel abstractions that deal with data.
          They represent the data that our business logic talks about.
          The do not 'model' our business logic.
        </li>

        <li>
          MVC controller actions are tied to a particular route.
          They expose our application to the web.
          But they are not the only gateway to our business logic.
          We may have a PubSub server, background jobs, and more software pieces that need to access or expose our business logic.
          It is not a good idea to tie our business logic to controllers.
          We need it to be independent.
        </li>
      </ul>

      <P>
        So we can conclude that business logic never had a place in MVC. Actually:
      </P>

      <Highlight>
        Business logic is a separate concern that deserves an especial place in our system architecture.
      </Highlight>

      <P>
        So what are the alternatives?
      </P>

      <PostSectionTitle>
        A new pattern: business actions
      </PostSectionTitle>

      <P>
        <HL external href={REFERENCES.trailblazer}>Trailblazer</HL>, <HL external href={REFERENCES.activeinteraction}>ActiveInteraction</HL> and <HL external href={REFERENCES.mutations}>Mutations</HL> are examples of libraries that deal with business logic. I failed to find libraries with a similar aim in the Node world.
      </P>

      <P>
        If you take a look at these libraries I mentioned you’ll see that all of them have something in common. They implement "business actions" or "business operations". And they revolve around the classic <HL href={REFERENCES.commandObject}>Command Object</HL> pattern.
      </P>

      <P>
        A "Business Action" (BA) represents an atomic operation on our data system, performed by a user.
      </P>

      <P>
        For example, consider a fictional BA called "InviteUserToTeam". For this BA to be performed, we need a performer, a team, and a user email. Here the team and the invited user are parameters for the BA.
      </P>

      <P>
        Business rules state what are valid values for these parameters. For example, we need the team and the user to exist. Our BA should enforce these validations. It should also provide us with useful error messages to give to the user.
      </P>

      <P>
        Another recurrent feature of business actions is the "allowance criteria". This is the set of business rules that defines whether our system should allow the performer to perform a given BA. For instance: "only team admins are allowed to invite new members".
      </P>

      <P>
        Finally, it is generally required to provide BA atomicity. This means we rollback changes to data in case of an error. The BA either succeeds or fails, but does not leave the system in an in-between state. This is important in BAs that result in changes to many different collections.
      </P>

      <P>
        Wrapping up, these are the base features of BA:
      </P>

      <ul>
        <li>it requires a performer</li>
        <li>it optionally accepts parameters</li>
        <li>it defines validations for the latter</li>
        <li>it provides atomicity</li>
      </ul>

      <P>
        This list of features is a generalization. Different business domains may need a different set of features.
      </P>

      <P>
        Continuing with the example I proposed, a Javascript implementation of the <code>InviteUserToTeam</code> BA would look like this:
      </P>

      <CodeSample>
        {`
          class InviteUserToTeam extends BusinessAction {
            validations = {
              teamId: { presence: true },
              email: { presence: true }
            }

            isAllowed() {
              return DB.teamMemberships.where({
                teamId: this.parameters.teamId,
                userId: this.performer.id,
                admin: true
              }).exists()
            }

            doPerform() {
              const { teamId, email } = this.params
              const transaction = this.transaction
              const user = DB.users.findOrCreate({ email }, { transaction })
              
              return DB.teamMemberships.insert({
                teamId: teamId,
                userId: user.id
              }, { transaction })
            }
          }

          const action = InviteUserToTeam({
            teamId: teamId, 
            email: ‘someemail@example.com’
          }, currentUser)

          action.perform()
        `}
      </CodeSample>

      <P>
        Notice how we extend <code>BusinessAction</code> here. In this example, this is an abstract class that encapsulates shared behaviour for all BAs.
      </P>

      <ul>
        <li>It defines a constructor that receives the parameters and the performer.</li>
        <li>It implements the declared validations.</li>
        <li>It performs the allowance check we define with <code>isAllowed</code>.</li>
        <li>It provides a transaction to wrap our DB calls with, rollbacking the changes in case of an error.</li>
      </ul>

      <P>Finally, it exposes all this behaviour through the <code>perform()</code> method.</P>

      <P>This is how the BusinessAction abstract class would look like:</P>

      <CodeSample>
        {`
          class BusinessAction {
            validations = {}

            constructor(params, performer) {
              this.params = params
              This.performer = performer
            }

            perform() {
              if (!this.isAllowed()) { throw BusinessAction.ForbiddenError }
              if (!this.isValid()) { throw BusinessAction.InvalidParametersError }

              this.transaction = DB.initTransaction()

              try {
                const result = this.doPerform()
                this.transaction.commit()
                return result
              } catch (error) {
                this.transaction.rollback()
                throw error
              }
            }

            isValid() {
              // … validate parameters using the declared validations
              // if not valid, generate a list of error messages
            }
          }
        `}
      </CodeSample>

      <PostSectionTitle>
        The benefits
      </PostSectionTitle>

      <P>
        Business actions provide a designated place for our business logic to live in.
        They help prevent our business logic from being scattered around our system.
        They talk declaratively about our business domain.
        All this makes it easier for new developers to understand the system.
      </P>

      <P>
        They also are composable.
        We can create new BAs by extending or calling existing ones.
      </P>

      <P>
        They benefit from shared behaviour.
        We could add features like history logging to all BAs by modifying the base class.
      </P>

      <PostSectionTitle>
        Conclusion
      </PostSectionTitle>

      <P>
        Our business logic and rules deserve a clear place in our system architecture.
        The Business Action pattern is a good tool for organizing business logic.
      </P>

      <P>
        It is not hard to implement business actions from scratch.
        However, I will soon be extracting the BA implementation that I used in the last NodeJS/GQL projects to an NPM package.
      </P>
    </Typography>
  )
}

const post = {
  date: new Date(2020, 4, 25),
  title: 'About business logic in data systems',
  description: 'How to organize it',
  component: Post,
  slug: 'about-business-logic-in-data-systems',
  tags: ['software', 'business-logic', 'nodejs', 'ruby', 'rails']
}

export default post
