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
 * launcher - function to handle launching
 * between shell builtins and other programs.
 * @str_ar: address of the array of strings
 * representing the parsed command line input.
 * @envp: the process' environment.
 * @bltin_nm: a NULL-terminated array of
 * strings representing the names of in-built functions.
 * @status: address of an int to be modified by the exit builtin.
 *
 * Notes: the program pathname represented by sarr[0] must exist.
 * Return: always 1; except when the shell is required to exit, then 0.
 */
int launcher(char **str_ar, char **envp, char **bltin_nm, int *status)
{
	int i, n;

	for (i = 0; bltin_nm[i]; i++)
	{
		if (_strcmp(bltin_nm[i], str_ar[0]) == 0)
		{
			return (launch_builtins(str_ar, i, status));
		}
	}

	n = launch_other(str_ar, envp);

	return (n);
}
