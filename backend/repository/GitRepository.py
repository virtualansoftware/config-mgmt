import requests
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


def fetch_full_tree(url, headers, prefix):
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        tree = response.json()["tree"]
        filtered_dirs = [
            item["path"] for item in tree if item["type"] == "blob" and prefix in item["path"]
        ]
        my_map = dict()
        for directory in filtered_dirs:
            appList = directory.replace(prefix + "/", "").split("/")
            my_child_map = dict()
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
    else:
        print(f"Failed to fetch the repository tree: {response.status_code}, {response.text}")
    return my_map

def fetch_full_tree_template(url, headers, prefix):
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        tree = response.json()["tree"]
        filtered_dirs = [
            item["path"] for item in tree if item["type"] == "blob" and prefix in item["path"]
        ]
        my_map = dict()

        for directory in filtered_dirs:
            appList = directory.replace(prefix + "/", "").split("/")
            if my_map.get(appList[0]) is None:
                my_list = []
                my_list.append(appList[1])
                my_map[appList[0]] = my_list
            else:
                my_list = my_map.get(appList[0])
                my_list.append(appList[1])
                my_map[appList[0]] = my_list
    else:
        print(f"Failed to fetch the repository tree: {response.status_code}, {response.text}")
    return my_map


def fetch_full_tree_common(url, headers, prefix):
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        tree = response.json()["tree"]
        filtered_dirs = [
            item["path"] for item in tree if item["type"] == "blob" and prefix in item["path"]
        ]
        my_map = dict()

        for directory in filtered_dirs:
            appList = directory.replace(prefix + "/", "").split("/")
            env_name = appList[0]
            common_file = appList[1]

            if env_name not in my_map:
                my_map[env_name] = []

            my_map[env_name].append(common_file)
    else:
        print(f"Failed to fetch the repository tree: {response.status_code}, {response.text}")
    return my_map

class GitRepository:

    def createFile(fileName: str, content: str, commitMessage: str):
        g = loginGitHub()
        repo = g.get_repo(settings.GITHUB_REPO_NAME)
        try:
            fileContents = repo.get_contents(f"./{fileName}", settings.BRANCH)
            repo.update_file(fileName, commitMessage, content, fileContents.sha, settings.BRANCH)
            print("Updated successfully!")
        except GithubException as ex:
            repo.create_file(fileName, commitMessage, content, settings.BRANCH)
            print("created successfully!")

    def get_all_generated_configurations():
        GITHUB_TOKEN = settings.GITHUP_TOKEN
        headers = {"Authorization": f"token {GITHUB_TOKEN}"} if GITHUB_TOKEN else {}
        repo = settings.GITHUB_REPO_NAME
        branch = settings.BRANCH  # Replace with the branch name
        # GitHub API endpoint for repo contents
        url = f"https://api.github.com/repos/{repo}/git/trees/{branch}?recursive=1"
        return fetch_full_tree(url, headers, settings.GENERATED_PREFIX)

    def get_all_configuration():
        GITHUB_TOKEN = settings.GITHUP_TOKEN
        headers = {"Authorization": f"token {GITHUB_TOKEN}"} if GITHUB_TOKEN else {}
        repo = settings.GITHUB_REPO_NAME
        branch = settings.BRANCH  # Replace with the branch name
        # GitHub API endpoint for repo contents
        url = f"https://api.github.com/repos/{repo}/git/trees/{branch}?recursive=1"
        return fetch_full_tree(url, headers, settings.APPLICATION_PREFIX)

    def get_all_common():
        GITHUB_TOKEN = settings.GITHUP_TOKEN
        headers = {"Authorization": f"token {GITHUB_TOKEN}"} if GITHUB_TOKEN else {}
        repo = settings.GITHUB_REPO_NAME
        branch = settings.BRANCH  # Replace with the branch name
        # GitHub API endpoint for repo contents
        url = f"https://api.github.com/repos/{repo}/git/trees/{branch}?recursive=1"
        return fetch_full_tree_common(url, headers, settings.COMMON_PREFIX)

    def get_all_template():
        GITHUB_TOKEN = settings.GITHUP_TOKEN
        headers = {"Authorization": f"token {GITHUB_TOKEN}"} if GITHUB_TOKEN else {}
        repo = settings.GITHUB_REPO_NAME
        branch = settings.BRANCH  # Replace with the branch name
        # GitHub API endpoint for repo contents
        url = f"https://api.github.com/repos/{repo}/git/trees/{branch}?recursive=1"
        return fetch_full_tree_template(url, headers, settings.TEMPLATE_PREFIX)

    def save_configuration(fileName: str, content: str, commitMessage: str):
        g = loginGitHub()
        repo = g.get_repo(settings.GITHUB_REPO_NAME)
        try:
            fileContents = repo.get_contents(f"./{fileName}", settings.BRANCH)
            repo.update_file(fileName, commitMessage, content, fileContents.sha, settings.BRANCH)
            print("Updated successfully!")
        except GithubException as ex:
            try:
                repo.create_file(fileName, commitMessage, json.dumps(content, sort_keys=True, indent=2), settings.BRANCH)
            except GithubException as ex:
                print("Not found " + print(ex))
                raise
            print("created successfully!")

    def save_common_configuration(fileName: str, content: str, commitMessage: str):
        g = loginGitHub()
        repo = g.get_repo(settings.GITHUB_REPO_NAME)
        try:
            fileContents = repo.get_contents(f"./{fileName}", settings.BRANCH)
            repo.update_file(fileContents.path, commitMessage, json.dumps(content, sort_keys=True, indent=2), fileContents.sha, settings.BRANCH)
            print("Updated successfully!")
        except GithubException as ex:
            try:
                repo.create_file(fileName, commitMessage, json.dumps(content, sort_keys=True, indent=2), settings.BRANCH)
            except GithubException as ex:
                print("Not found " + print(ex))
                raise
            print("created successfully!")

    def updateFile(filePathName: str, fileName: str, newContent: str, commitMessage: str):
        g = loginGitHub()
        repo = g.get_repo(settings.GITHUB_REPO_NAME)
        repo.update_file(filePathName, commitMessage, newContent, settings.BRANCH)
        print("--- File updated successfully")

    def generate_object(fileName: str, templateGenerated: str, commitMessage: str):
        g = loginGitHub()
        repo = g.get_repo(settings.GITHUB_REPO_NAME)
        try:
            fileContents = repo.get_contents(f"./{fileName}")
            repo.update_file(fileName, commitMessage, templateGenerated, fileContents.sha, settings.BRANCH)
            print("Updated successfully!")
        except GithubException as ex:
            try:
                repo.create_file(fileName, commitMessage, templateGenerated, settings.BRANCH)
            except GithubException as ex:
                return '{"file" : "not_found"} '
            print("created successfully!")

    def getObject(fileName: str):
        try:
            g = loginGitHub()
            repo = g.get_repo(settings.GITHUB_REPO_NAME)
            fileContents = repo.get_contents(f"./{fileName}", settings.BRANCH)
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
            repo.create_git_ref(f"refs/heads/{branch_name}", repo.get_branch("main").commit.sha, settings.BRANCH)
        repo.create_file(fileName, commitMessage, contents, branch=branch_name)
        print("File created in demo branch!")

    def updateFileBranch(fileName, branchName, contents, commitMessage: str):
        g = loginGitHub()
        repo = g.get_repo(settings.GITHUB_REPO_NAME)
        try:
            repo.get_branch(branchName)
        except:
            repo.create_git_ref(f"refs/heads/{branchName}", repo.get_branch("main").commit.sha, settings.BRANCH)

        repo.update_file(fileName, commitMessage, contents, contents.sha, branch=branchName)
        print("File updated in demo branch!")
