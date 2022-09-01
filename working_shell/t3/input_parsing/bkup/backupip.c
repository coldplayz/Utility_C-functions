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
 * in_parser - gets a line of input and
 * processes it to be suitable to be passed to execve().
 * @line: string representing the line of input to process.
 * @envp: the environment of the process as taken from main's third argument.
 *
 * Return: a NULL-terminated array of strings
 * representing each word from the command-line input;
 * or NULL if the first word is not a found command.
 */
char **in_parser(char *line, char *envp[])
{
	char **str_ar;

	str_ar = str_arr(line, " \n"); /* 'line' is modified after call to str_ar */
	if ((!str_ar[0]) || (rel_srch(str_ar[0])))
	{
		return (str_ar);
	}

	abs_srch(&str_ar, envp);

	return (str_ar);
}


/**
 * rel_srch - checks if cmd is a valid path to a file.
 * @cmd: the string representing the pathname
 *
 * Return: 1 if the pathname is valid; 0 otherwise.
 */
int rel_srch(char *cmd)
{
	struct stat st;

	if (stat(cmd, &st) != 0)
	{
		return (0);
	}

	return (1);
}


/**
 * abs_srch - checks if cmd can be found in any
 * of the paths listed in the PATH environment variable.
 * @cmd: address of pointer to the string representing the command.
 * @envp: the process's environment.
 *
 * Description: the value of the first element of the array of
 * strings whose address is passed as sarr is modified to be a
 * pointer to the absolute path for the command, if it's found;
 * otherwise, if the command represented by that first
 * element is not found, the array of strings is made to point to NULL.
 */
void abs_srch(char ***sarr, char **envp)
{
	char *ptc;

	ptc = isinPATH2((*sarr)[0], envp);
	if (!ptc)
	{
		*sarr = NULL;
	}
	else
	{
		free((*sarr)[0]);
		(*sarr)[0] = ptc;
	}
}




#define ps(x) printf("%s\n", x)
#define pd(x) printf("%d\n", x)
#define plu(x) printf("%lu\n", x)


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
	char *path, **pathsv, *paths = getenv3("PATH", envp);
	struct stat st;
	int i;

	if (!paths)
	{
		write(STDERR_FILENO, "isinPATH2: pathnoval\n", 21);
		return (NULL);
	}
	else
	{
		pathsv = str_arr(paths, ":");
	}

	for (i = 0; pathsv[i]; i++)
	{
		path = strconcatl(3, pathsv[i], "/", cmd_name);
		if (stat(path, &st) == 0)
		{
			return (path);
		}
	}

	return (NULL);
}





/**
 * getenv3 - my personal implementation of the library's getenv() function.
 * This version uses the environment represented by main's third argument.
 * @name: variable name.
 * @envp: the environment to fetch the path from.
 *
 * Description: see man getenv for more datails.
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
