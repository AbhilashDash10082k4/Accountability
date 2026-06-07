/*Functions-
-should create, store, delete read tasks from the DB
-should store the tasks in the frontend
-should have a blocking engine-
    -should have a high level long term goal and should provide the path he has chosen - the LLM call is made to analyze the path and give a roadmap to reach the goal
    -create tasks, store in DB
    -select apps to block
    -should accept proper proofs (may be a LLM call or hardcoded defined tasks with their proof types
    -proof types and task types should go in sync-
    e.g- 
        1.website dev-(github link, hosted link)- the task should be able clearly defined and the proof should be particular accordingly
        2.Pushups/physical activity- live recording -video upload- some kind of analysis (may be duration or a LLM call to confirm the proof)
        3.cold out reach -integrate with Gmail to automatically read the mails, or provide screen shot of the mails
    -the proof inspection mechanism should be robust for each type
    -after the tasks have been proved to be complete, the blocked apps should unlock
*/
