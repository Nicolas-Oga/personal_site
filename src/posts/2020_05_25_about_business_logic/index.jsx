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
      <P>
        <HL external href={REFERENCES.wikipedia}>Wikipedia</HL> definition of business logic:
      </P>

      <Highlight>
        ... the part of the program that encodes the real-world business rules that determine how data can be created, stored, and changed.
        <br/>
        In contrast with the remainder of the software that might be concerned with lower-level details of managing a database or displaying the user interface, system infrastructure, or generally connecting various parts of the program.
      </Highlight>

      <PostSectionTitle>
        Traditionnal approach
      </PostSectionTitle>

      <P>
        The Model-View-Controller pattern is the most popular pattern in the web world.
      </P>

      <ul>
        <li>
          <strong>Model:</strong> enables interaction with data.
        </li>
        
        <li>
          <strong>Controller:</strong> handles a particular set of requests.
        </li>

        <li>
          <strong>View:</strong> a template with embedded language expressions, like ERB or Jade (Pug).
        </li>
      </ul>

      <P>
        This pattern feels natural in the development of server-side sites to implement the inner workings of an HTTP server.
        Yet, organizing the entire codebase around MVC leads to some problems.
      </P>

      <P>
        Two of these problems are fat controllers and fat models.
      </P>

      <P>
        “Models” sounds generic enough that it is tempting to place business logic there.
        But their original purpose was to validate and store data.
      </P>

      <P>
        Single page applications and technologies like GraphQL are becoming popular.
        In this reality, the "View" and "Controller" in MVC become less and less relevant.
      </P>

      <P>
        When compared to Wikipedia's definition of business logic:
      </P>

      <ul>
        <li>
          MVC models are low-lovel abstractions that deal with data.
          They represent the data that our business logic talks about.
          The do not 'model' our business logic.
        </li>

        <li>
          MVC controller actions are tied to a particular HTTP route.
          They expose our application to the web.
          But they are not the only gateway to our business logic.
          We may have a PubSub server, background jobs, and more software pieces that need to access or expose business logic.
          It is not a good idea to tie business logic to controllers.
          We need it to be independent.
        </li>
      </ul>

      In conclusion:

      <Highlight>
        Business logic is a separate concern that deserves an especial place in our system architecture.
      </Highlight>

      <P>
        So what are the alternatives?
      </P>

      <PostSectionTitle>
        A different pattern: business actions
      </PostSectionTitle>

      <P>
        <HL external href={REFERENCES.trailblazer}>Trailblazer</HL>, <HL external href={REFERENCES.activeinteraction}>ActiveInteraction</HL> and <HL external href={REFERENCES.mutations}>Mutations</HL> are examples of libraries that deal with business logic.
      </P>

      <P>
        They implement "business actions" or "business operations". And they revolve around the classic <HL href={REFERENCES.commandObject}>Command Object</HL> pattern.
      </P>

      <P>
        A "Business Action" (BA) represents an atomic operation on our data system, performed by a user.
      </P>

      <P>
        For example, consider a fictional BA called "InviteUserToTeam". This BA requires a performer, a team, and a user email. Here the team and the invited user are parameters for the BA.
      </P>

      <P>
        Business rules state what are valid values for these parameters. For example, we need the team and the user to exist. Our BA should enforce these validations. It should also provide useful error messages when validations fail.
      </P>

      <P>
        Another recurrent feature of business actions is the "allowance criteria" or access control. For instance: "only team admins are allowed to invite new members".
      </P>

      <P>
        BA should also implement atomicity: ability to rollback changes to data in case of an error. The BA either succeeds or fails, but does not leave the system in an in-between state.
      </P>

      <P>
        Wrapping up, these are the some of the features of a good BA implementation:
      </P>

      <ul>
        <li>requires a performer</li>
        <li>optionally accept parameters</li>
        <li>defines validations for parameters</li>
        <li>provides atomicity</li>
      </ul>

      <P>
        Here is a Javascript implementation of the <code>InviteUserToTeam</code> from our example:
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
        We extend <code>BusinessAction</code> base class here.
        This is an abstract class that encapsulates shared behaviour for all BAs.
      </P>

      <ul>
        <li>It defines a constructor that receives the parameters and the performer.</li>
        <li>It implements the declared validations.</li>
        <li>It performs the allowance check we define with <code>isAllowed</code>.</li>
        <li>It provides a transaction to wrap our DB calls with, rollbacking the changes in case of an error.</li>
      </ul>

      <P>Finally, it exposes all this behaviour through the <code>perform()</code> method.</P>

      <P>The BusinessAction abstract class implementation:</P>

      <CodeSample>
        {`
          class BusinessAction {
            validations = {}

            constructor(params, performer) {
              this.params = params
              This.performer = performer
            }

            perform() {
              if (!this.isAllowed()) { throw new BusinessAction.ForbiddenError() }
              if (!this.isValid()) { throw new BusinessAction.InvalidParametersError() }

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
        Benefits
      </PostSectionTitle>

      <P>
        Business actions provide a designated place for business logic to live in.
        They prevent business logic from scattering around the system.
        They talk declaratively about business domain.
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
        Business logic deserves a clear place in our system architecture.
        The Business Action pattern is a good tool for this purpose.
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
  title: 'How to organize Business Logic in Web Applications',
  component: Post,
  slug: 'about-business-logic-in-data-systems',
  tags: ['software', 'business-logic', 'nodejs', 'ruby', 'rails']
}

export default post
