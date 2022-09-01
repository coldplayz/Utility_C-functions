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
 * launch_builtins - launches builtin shell programs.
 * @sarr: pointer to the string array
 * containing program name, and, possibly, arguments.
 * @n: the index pointing to the function to invoke.
 * @status: the address of an int to be modified by the exit builtin.
 *
 * Description: all programs (builtins) launched by this function
 * must take a double pointer to
 * command-line input and a pointer to int, and return 1, or 0.
 * Notes: the program pathname represented by sarr[0] must exist.
 * Return: always 1 (the return value of the program it launches);
 * except when the shell program returns 0, as in the case of exit().
 */
int launch_builtins(char **sarr, int n, int *status)
{
	int (*bltin_func[])(char **, int *) = {exit2, NULL};

	return (bltin_func[n](sarr, status));
}
