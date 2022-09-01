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
#define plu(x) (printf("%lu", (x)))

/**
 * main - a simple shell
 *
 * Return: always 0
 */
int main (int argc __attribute__((unused)), char *argv[], char *envp[])
{
	size_t n = 0;
	int status = 0, m, a = 1, b = 1;
	char *line, **str_ar, *bltin_nm[] = {"exit", NULL};

	while (a)
	{
		line = NULL;
		printf("#cisfun$ ");
		m = getline(&line, &n, stdin);
		if (m == EOF)
		{
			free(line);
			return (0);
		}

		str_ar = in_parser(line, envp, bltin_nm, &b);
		if (!str_ar)
		{
			free(line);
			printf("%s: No such file or directory\n", argv[0]);
			continue;
		}
		if (str_ar[0] == NULL)
		{
			handle_free("sd", b, line, str_ar);
			continue;
		}

		a = launcher(str_ar, envp, bltin_nm, &status);

		handle_free("ssd", b, line, str_ar[0], str_ar);
		b = 1;
	}

	return (status);
}
