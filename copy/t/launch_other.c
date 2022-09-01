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
 * launch_other - launches programs that are not builtins.
 * @sarr: array of strings containing command-line arguments for the program.
 * @envp: array of strings containing the process's environment.
 *
 * Notes: the program pathname represented by sarr[0] must exist.
 * Return: always 1.
 */
int launch_other(char **sarr, char **envp)
{
	int status;
	pid_t pid1;

	pid1 = fork();
	if (pid1 == -1)
	{
		perror("launch_other");
		return (1);
	}
	else
	{
		if (pid1 == 0)
		{
			if (execve(sarr[0], sarr, envp) == -1)
			{
				perror("launch_other");
				return (1);
			}
		}
		else
		{
			wait(&status);
			return (1);
		}
	}

	return (1);
}
