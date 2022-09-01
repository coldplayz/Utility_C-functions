#include <sys/types.h>
#include <sys/stat.h>
#include <sys/wait.h>
#include <fcntl.h>
#include <unistd.h>
#include <stdlib.h>
#include <string.h>
#include <stdio.h>
#include <errno.h>
#include <signal.h>
#include <dirent.h>
#include "main.h"

#define ex (execve("/bin/ls", args, NULL) == (-1))
#define ps(x) (printf("%s\n", (x)))
#define pd(x) (printf("%d\n", (x)))


/**
 * isinPATH2 - checks if a command/program name is
 * in any of the paths specified in the environment variable PATH.
 * This version uses the environment in main's third parameter.
 * @cmd_name: program name
 * @envp: the process's environment.
 *
 * Helper:
 * 1. strconcatl()
 * 2. str_arr()
 * 3. getenv2()
 * Return: a pointer to the string representing the name of the
 * found path, or NULL if the command name is not found in any of the paths.
 */
char *isinPATH2(char *cmd_name, char **envp)
{
	char *path, **pathsv, *paths_cpy, *paths = getenv3("PATH", envp);
	struct stat st;
	int i;

	if (!paths)
	{
		write(STDERR_FILENO, "isinPATH2: pathnoval\n", 21);
		return (NULL);
	}
	else
	{
		paths_cpy = strdup2(paths);
		pathsv = str_arr(paths_cpy, ":");
	}

	for (i = 0; pathsv[i]; i++)
	{
		path = strconcatl(3, pathsv[i], "/", cmd_name);
		if (stat(path, &st) == 0)
		{
			free(paths_cpy);
			free(pathsv);
			return (path);
		}
		free(path);
	}
	free(paths_cpy);
	free(pathsv);

	return (NULL);
}
