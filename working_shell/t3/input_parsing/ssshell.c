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
 * main - a simple shell
 *
 * Return: always 0
 */
int main (int argc __attribute__((unused)), char *argv[], char *envp[])
{
	pid_t pid1;
	size_t n = 0;
	int stat1, m;
	char *line, **str_ar;

	while (1)
	{
		line = NULL;
		printf("#cisfun$ ");
		m = getline(&line, &n, stdin);
		if (m == EOF)
		{
			free(line);
			return (0);
		}

		str_ar = in_parser(line, envp);
		if (!str_ar)
		{
			free(line);
			printf("%s: No such file or directory\n", argv[0]);
			continue;
		}
		if (str_ar[0] == NULL)
		{
			free(str_ar);
			free(line);
			continue;
		}


		pid1 = fork();
		if (pid1 == -1)
			perror("pid1-ssshell");
		if (pid1 == 0)
		{
			if (execve(str_ar[0], str_ar, envp) == -1)
			{
				perror(argv[0]);
				return (1);
			}
		}
		else
		{
			wait(&stat1);
			free(line);
			free(str_ar[0]);
			free(str_ar);
		}
	}

	return (0);
}
