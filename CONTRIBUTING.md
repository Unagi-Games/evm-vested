# Contribution guide

## Workflow

### Master branch & production

Basic rules:

* The HEAD of the master branch **MUST** be deployable in production.
* You **MUST NOT** deploy to production a commit that is NOT merged in master.
* You **MUST NOT** push directly to this branch, nor to _develop_.
* You **MUST** always branch from _master_ or _develop_ when starting work on a new feature, depending on your workflow.
* When a feature is ready, you **MUST** update the related merge request. See [Merge Requests] below.
* You **MUST** always branch from master when starting work on a hotfix for production.
* _master_ and/or _develop_ branches **MUST** be protected in Gitlab settings.

### Branching conventions

You **MUST** follow the following naming convention when creating a new public branch from _master_ or _develop_:

```
[<branch-type>/]<tracker-ref>-<branch-name>
```

`<branch-type>` is one of:

* `feat`: New feature
* `fix`: Fix(es) to an existing feature
* `hotfix`: Branched from _master_. **MUST** contain only hotfixes for production.
* `quality`: Refactoring of a whole feature/service/concept/...
* `misc`: Anything that does not fit in the categories above

`<tracker-ref>` is the reference to the ticket number.

All branches **SHOULD** always be up to date with their base branch when the merge request is created.

Examples:

```
feat/192-bulk-customer-export
961-csv-data-import
fix/27-forgot-password
```

### Commit messages

Every commit message **MUST** be written in english and adopt the following format:

```
<tracker-ref> <commit subject>
<BLANK LINE>
<commit body>
```

If necessary, you **SHOULD** add a longer message to the commit body explaining what you did in greater detail. Please keep lines no longer than 74 characters.

**tracker-ref**

Refers to the ticket number.

**commit subject**

The details about what exactly you did within the scope of your commit.
Use the present tense ("Add feature" not "Added feature")
Use the imperative mood ("Move cursor to..." not "Moves cursor to...")

**Examples :**

```
1234 Add many-to-many relation to customers
4761 Add test for empty password
4532 PSR multiline array and type hinting
4761 Add new AWS key
8642 New way of exporting Customers
```

## Merge requests

In order to be considered OK to merge, your MR has to pass all of these conditions:

* MR template has been correctly filled.
* CI is passing (and new tests are written if applicable).
* Gitlab setting to block merge if CI is not passing **MUST** be enabled.
* Reviewers should have pulled the code and ran it locally.
  _Hint:_ Think of [git-worktree](https://git-scm.com/docs/git-worktree). Very useful to do work on another branch without stashing anything.
* Docs and comments **MUST** be committed & up to date
* All discussions (if any) **MUST** be resolved.
* Gitlab setting to block merge if discussions are not all resolved **MUST** be enabled.
* MR has been approved by the reviewer, and a second engineer if possible
* In case of conflicts, they **MUST** be resolved prior to merging.

Only then the reviewer you assigned will proceed to merge your branch. Please note that the source branch will be deleted upon merging.