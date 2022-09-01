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
 * getenv3 - my personal implementation of the library's getenv() function.
 * This version uses the environment represented by main's third argument.
 * @name: variable name.
 * @envp: the environment to fetch the path from.
 *
 * Description: see man getenv for more datails.
 * As this version uses the main function's envp parameter,
 * which will be used as a source of the
 * environment for this shell, be extremely careful
 * not to [unintentionally] change the value as returned from this function.
 * Return: variable's value or NULL.
 */
char *getenv3(const char *name, char **envp)
{
	int i, j, flag = 0, len;

	if (!name)
	{
		return (NULL);
	}

	len = _strlen((char *)name);
	for (i = 0; envp[i]; i++)
	{
		for (j = 0; j < len; j++)
		{
			if (name[j] == envp[i][j])
			{
				if ((envp[i][j + 1] == '='))
				{
				/* if xters match */
				flag = 1;
				}
			}
			else
			{
				/* otherwise leave this loop and go to the next env variable */
				flag = 0;
				break;
			}
		}
		if (flag)
		{
			/* if all specified xters match */
			return (envp[i] + j + 1);
		}
	}

	return (NULL);
}
