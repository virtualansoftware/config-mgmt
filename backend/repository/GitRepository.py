from github import Github, Auth, GithubException
from settings import settings
import json
import base64
def loginGitHub():
    token = settings.GITHUP_TOKEN
    auth = Auth.Token(token)
    g = Github(auth=auth) #, base_url=settings.GITHUB_HOST_URL)
    print("token verified")
    return g
class GitRepository:

    def createFile(fileName: str, content: str, commitMessage: str):
        g = loginGitHub()
        repo = g.get_repo(settings.GITHUB_REPO_NAME)
        try:
            fileContents = repo.get_contents(f"./{fileName}")
            repo.update_file(fileName, commitMessage, content, fileContents.sha)
            print("Updated successfully!")
        except GithubException as ex:
            repo.create_file(fileName, commitMessage, content)
            print("created successfully!")

    def get_all_configuration():
        g = loginGitHub()
        repo = g.get_repo(settings.GITHUB_REPO_NAME)
        contents = repo.get_contents("")
        my_map = dict()
        while contents:
            file_content = contents.pop(0)
            my_child_map = dict()
            if file_content.type == "dir":
                contents.extend(repo.get_contents(file_content.path))
            else:
                if settings.APPLICATION_PREFIX in file_content.path:
                    appList = file_content.path.replace(settings.APPLICATION_PREFIX, "").split("/")
                    if my_map.get(appList[0]) is None:
                        my_child_map = dict()
                        my_list = [appList[2]]
                        my_child_map[appList[1]] = my_list
                        my_map[appList[0]] = my_child_map
                    elif my_child_map.get(appList[1]) is None:
                        my_child_map = my_map[appList[0]]
                        my_list = my_child_map.get(appList[1])
                        if my_list is None:
                            my_list = []
                        my_list.append(appList[2])
                        my_child_map[appList[1]] = my_list
                        my_map[appList[0]] = my_child_map
                    else:
                        my_child_map = my_map.get(appList[0])
                        my_list = my_child_map.get(appList[1])
                        my_list.append(appList[2])
                        my_child_map[appList[1]] = my_list
                        my_map[appList[0]] = my_child_map
        return my_map

    def save_configuration(fileName: str, content: str, commitMessage: str):
        g = loginGitHub()
        repo = g.get_repo(settings.GITHUB_REPO_NAME)
        try:
            fileContents = repo.get_contents(f"./{fileName}")
            repo.update_file(fileName, commitMessage, content, fileContents.sha)
            print("Updated successfully!")
        except GithubException as ex:
            try:
                repo.create_file(fileName, commitMessage, json.dumps(content))
            except GithubException as ex:
                print("Not found " + print(ex))
                raise
            print("created successfully!")
    def updateFile(filePathName: str, fileName: str, newContent: str, commitMessage: str):
        g = loginGitHub()
        repo = g.get_repo(settings.GITHUB_REPO_NAME)
        repo.update_file(filePathName, commitMessage, newContent)
        print("--- File updated successfully")

    def generate_object(fileName: str, templateGenerated: str, commitMessage: str):
        g = loginGitHub()
        repo = g.get_repo(settings.GITHUB_REPO_NAME)
        try:
            fileContents = repo.get_contents(f"./{fileName}")
            repo.update_file(fileName, commitMessage, templateGenerated, fileContents.sha)
            print("Updated successfully!")
        except GithubException as ex:
            try:
                repo.create_file(fileName, commitMessage, json.dumps(templateGenerated))
            except GithubException as ex:
                return '{"file" : "not_found"} '
            print("created successfully!")

    def getObject(fileName: str):
        try:
            g = loginGitHub()
            repo = g.get_repo(settings.GITHUB_REPO_NAME)
            fileContents = repo.get_contents(f"./{fileName}")
            return base64.b64decode(fileContents.content)
        except GithubException as ex:
            raise
    def createFileBranch(fileName, branch, contents, commitMessage: str):
        g = loginGitHub()
        repo = g.get_repo(settings.GITHUB_REPO_NAME)
        branch_name = branch
        try:
            repo.get_branch(branch_name)
        except:
            repo.create_git_ref(f"refs/heads/{branch_name}", repo.get_branch("main").commit.sha)
        repo.create_file(fileName, commitMessage, contents, branch=branch_name)
        print("File created in demo branch!")

    def updateFileBranch(fileName, branchName, contents, commitMessage: str):
        g = loginGitHub()
        repo = g.get_repo(settings.GITHUB_REPO_NAME)
        try:
            repo.get_branch(branchName)
        except:
            repo.create_git_ref(f"refs/heads/{branchName}", repo.get_branch("main").commit.sha)

        repo.update_file(fileName, commitMessage, contents, contents.sha, branch=branchName)
        print("File updated in demo branch!")